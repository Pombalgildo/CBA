#!/usr/bin/env python3
"""
Patches all admin API routes to use requireTabAccess instead of the simple
getTokenFromRequest check.

For each route under src/app/api/admin/<resource>/route.ts and
src/app/api/admin/<resource>/[id]/route.ts, we:
1. Replace the import of getTokenFromRequest with requireTabAccess
2. Replace the simple auth check pattern with requireTabAccess call
"""
import re
import os
from pathlib import Path

# Map: route folder -> tab key (as defined in ADMIN_TABS)
TAB_MAP = {
    'avisos': 'avisos',
    'news': 'noticias',
    'publications': 'publicacoes',
    'events': 'eventos',
    'churches': 'igrejas',
    'ministries': 'ministerios',
    'quem-somos': 'quem-somos',
    'donation-categories': 'doacoes-cats',
    'donations': 'doacoes',
    'messages': 'mensagens',
    'settings': 'definicoes',
}

ADMIN_DIR = Path('/home/z/my-project/src/app/api/admin')

# Pattern 1: simple local auth helper (most routes)
#   import { getTokenFromRequest } from '@/lib/auth'
#   function auth(request: Request) { return !!getTokenFromRequest(request) }
#
# Pattern 2: inline use (settings route)
#   if (!getTokenFromRequest(request)) { return NextResponse.json(...) }

OLD_IMPORT = "import { getTokenFromRequest } from '@/lib/auth'"
NEW_IMPORT = "import { requireTabAccess } from '@/lib/authz'"

# Pattern for the local helper function
LOCAL_HELPER_RE = re.compile(
    r"function auth\(request: Request\)\s*\{[^}]*getTokenFromRequest\(request\)[^}]*\}",
    re.MULTILINE | re.DOTALL
)

# Pattern for inline calls: `if (!auth(request)) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })`
INLINE_AUTH_RE = re.compile(
    r"if \(!auth\(request\)\)\s*return NextResponse\.json\(\{\s*error:\s*'[^']+'\s*\},\s*\{\s*status:\s*401\s*\}\)"
)

# Pattern for direct getTokenFromRequest usage
DIRECT_AUTH_RE = re.compile(
    r"if \(!getTokenFromRequest\(request\)\)\s*\{\s*return NextResponse\.json\(\{\s*error:\s*'[^']+'\s*\},\s*\{\s*status:\s*401\s*\}\)\s*\}"
)

def patch_file(path: Path, tab_key: str) -> bool:
    """Returns True if file was modified."""
    text = path.read_text(encoding='utf-8')
    original = text

    # 1. Replace import
    if OLD_IMPORT in text:
        text = text.replace(OLD_IMPORT, NEW_IMPORT)

    # 2. Remove the local helper function (if present)
    text = LOCAL_HELPER_RE.sub('', text)

    # 3. Replace inline `if (!auth(request))` patterns with requireTabAccess call
    # We need to make these routes async if they aren't already
    # Pattern: at the start of an async function body
    replacement = (
        f"const {{ response }} = await requireTabAccess(request, '{tab_key}')\n"
        f"  if (response) return response"
    )

    # Replace `if (!auth(request)) return ...` (single line)
    text = INLINE_AUTH_RE.sub(replacement, text)

    # Replace direct `if (!getTokenFromRequest(request)) { return ... }`
    text = DIRECT_AUTH_RE.sub(replacement, text)

    # 4. Ensure functions are async — they already are in this codebase

    if text != original:
        # Clean up: remove any empty lines left by the helper removal
        text = re.sub(r'\n\n\n+', '\n\n', text)
        path.write_text(text, encoding='utf-8')
        return True
    return False


def main():
    patched = []
    skipped = []

    for folder_name, tab_key in TAB_MAP.items():
        folder = ADMIN_DIR / folder_name
        if not folder.exists():
            skipped.append(f"folder not found: {folder}")
            continue

        # Patch route.ts
        route_file = folder / 'route.ts'
        if route_file.exists():
            if patch_file(route_file, tab_key):
                patched.append(str(route_file))
            else:
                skipped.append(f"no changes: {route_file}")

        # Patch [id]/route.ts
        id_file = folder / '[id]' / 'route.ts'
        if id_file.exists():
            if patch_file(id_file, tab_key):
                patched.append(str(id_file))
            else:
                skipped.append(f"no changes: {id_file}")

    print("PATCHED:")
    for p in patched:
        print(f"  ✓ {p}")
    print()
    print("SKIPPED:")
    for s in skipped:
        print(f"  - {s}")


if __name__ == '__main__':
    main()
