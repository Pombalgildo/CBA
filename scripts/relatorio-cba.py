#!/usr/bin/env python3
"""
Relatório de Prestação de Contas e Entrega Técnica — CBA
Gera um PDF profissional com ReportLab
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak,
    KeepTogether, Image, HRFlowable, PageTemplate, Frame, NextPageTemplate
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily
from reportlab.graphics.shapes import Drawing, Rect, Line, String
from reportlab.platypus.flowables import Flowable

# ─── Font Registration ───
FONT_DIR = '/usr/share/fonts'
pdfmetrics.registerFont(TTFont('NotoSerifSC', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Regular.ttf'))
pdfmetrics.registerFont(TTFont('NotoSerifSC-Bold', f'{FONT_DIR}/truetype/noto-serif-sc/NotoSerifSC-Bold.ttf'))
registerFontFamily('NotoSerifSC', normal='NotoSerifSC', bold='NotoSerifSC-Bold')

pdfmetrics.registerFont(TTFont('NotoSans', f'{FONT_DIR}/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('NotoSans-Bold', f'{FONT_DIR}/truetype/dejavu/DejaVuSans-Bold.ttf'))
registerFontFamily('NotoSans', normal='NotoSans', bold='NotoSans-Bold')

# ─── CBA Color Palette ───
CBA_GREEN = colors.HexColor('#1a3a2a')
CBA_RED = colors.HexColor('#b91c1c')
CBA_GOLD = colors.HexColor('#c4962e')
CBA_DARK = colors.HexColor('#232220')
CBA_MUTED = colors.HexColor('#6b6b6b')
CBA_LIGHT_BG = colors.HexColor('#f5f3f0')
CBA_BORDER = colors.HexColor('#d4d0c8')
WHITE = colors.white

# ─── Page dimensions ───
PAGE_W, PAGE_H = A4
MARGIN_L = 25 * mm
MARGIN_R = 25 * mm
MARGIN_T = 30 * mm
MARGIN_B = 25 * mm
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

# ─── Styles ───
styles = getSampleStyleSheet()

style_cover_title = ParagraphStyle('CoverTitle', fontName='NotoSerifSC-Bold', fontSize=22, leading=28, alignment=TA_CENTER, textColor=WHITE, spaceAfter=8)
style_cover_subtitle = ParagraphStyle('CoverSubtitle', fontName='NotoSans', fontSize=13, leading=18, alignment=TA_CENTER, textColor=colors.HexColor('#d4d0c8'), spaceAfter=6)
style_cover_meta = ParagraphStyle('CoverMeta', fontName='NotoSans', fontSize=10, leading=14, alignment=TA_CENTER, textColor=colors.HexColor('#a8a298'))

style_h1 = ParagraphStyle('H1', fontName='NotoSerifSC-Bold', fontSize=15, leading=20, textColor=CBA_GREEN, spaceBefore=20, spaceAfter=10, borderWidth=0, borderPadding=0)
style_h2 = ParagraphStyle('H2', fontName='NotoSerifSC-Bold', fontSize=12, leading=16, textColor=CBA_DARK, spaceBefore=14, spaceAfter=6)
style_body = ParagraphStyle('Body', fontName='NotoSans', fontSize=10.5, leading=16, textColor=CBA_DARK, alignment=TA_JUSTIFY, spaceAfter=8)
style_body_bold = ParagraphStyle('BodyBold', fontName='NotoSans-Bold', fontSize=10.5, leading=16, textColor=CBA_DARK, alignment=TA_JUSTIFY, spaceAfter=8)
style_table_header = ParagraphStyle('TableHeader', fontName='NotoSans-Bold', fontSize=9.5, leading=12, textColor=WHITE, alignment=TA_LEFT)
style_table_cell = ParagraphStyle('TableCell', fontName='NotoSans', fontSize=9.5, leading=13, textColor=CBA_DARK, alignment=TA_LEFT)
style_table_cell_right = ParagraphStyle('TableCellR', fontName='NotoSans', fontSize=9.5, leading=13, textColor=CBA_DARK, alignment=TA_RIGHT)
style_table_cell_bold = ParagraphStyle('TableCellB', fontName='NotoSans-Bold', fontSize=9.5, leading=13, textColor=CBA_DARK, alignment=TA_LEFT)
style_footer = ParagraphStyle('Footer', fontName='NotoSans', fontSize=8, leading=10, textColor=CBA_MUTED, alignment=TA_CENTER)
style_signature = ParagraphStyle('Signature', fontName='NotoSerifSC-Bold', fontSize=11, leading=14, textColor=CBA_DARK, alignment=TA_CENTER, spaceBefore=30)

# ─── Cover Page Flowable ───
class CoverPage(Flowable):
    """Full-page cover with CBA branding"""
    def __init__(self):
        Flowable.__init__(self)
        self.width = PAGE_W
        self.height = PAGE_H

    def draw(self):
        c = self.canv
        # Full dark green background
        c.setFillColor(CBA_GREEN)
        c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

        # Gold accent line top
        c.setStrokeColor(CBA_GOLD)
        c.setLineWidth(3)
        c.line(40*mm, PAGE_H - 35*mm, PAGE_W - 40*mm, PAGE_H - 35*mm)

        # Title block
        c.setFillColor(WHITE)
        c.setFont('NotoSerifSC-Bold', 20)
        c.drawCentredString(PAGE_W / 2, PAGE_H - 65*mm, 'Relatório de Prestação de Contas')
        c.drawCentredString(PAGE_W / 2, PAGE_H - 78*mm, 'e Entrega Técnica')

        # Subtitle
        c.setFont('NotoSans', 13)
        c.setFillColor(colors.HexColor('#d4d0c8'))
        c.drawCentredString(PAGE_W / 2, PAGE_H - 95*mm, 'Construção e Lançamento do Site Oficial')
        c.drawCentredString(PAGE_W / 2, PAGE_H - 107*mm, 'da Convenção Baptista de Angola')

        # Gold accent line bottom
        c.setStrokeColor(CBA_GOLD)
        c.setLineWidth(2)
        c.line(50*mm, PAGE_H - 125*mm, PAGE_W - 50*mm, PAGE_H - 125*mm)

        # Meta info
        c.setFont('NotoSans', 11)
        c.setFillColor(WHITE)
        c.drawCentredString(PAGE_W / 2, PAGE_H - 145*mm, 'Apresentado à Direcção da')
        c.drawCentredString(PAGE_W / 2, PAGE_H - 158*mm, 'Convenção Baptista de Angola')

        c.setFont('NotoSans', 10)
        c.setFillColor(colors.HexColor('#a8a298'))
        c.drawCentredString(PAGE_W / 2, 45*mm, 'Luanda, Julho de 2026')
        c.drawCentredString(PAGE_W / 2, 35*mm, 'Elaborado por: Hermenegildo José Pombal')

        # Red accent at very bottom
        c.setFillColor(CBA_RED)
        c.rect(0, 0, PAGE_W, 8*mm, fill=1, stroke=0)

        # Gold thin line above red
        c.setFillColor(CBA_GOLD)
        c.rect(0, 8*mm, PAGE_W, 1.5*mm, fill=1, stroke=0)


# ─── Section divider ───
class SectionDivider(Flowable):
    def __init__(self, width=CONTENT_W):
        Flowable.__init__(self)
        self.width = width
        self.height = 6

    def draw(self):
        c = self.canv
        c.setFillColor(CBA_GOLD)
        c.rect(0, 2, self.width, 2, fill=1, stroke=0)
        c.setFillColor(CBA_RED)
        c.rect(0, 0, 30*mm, 2, fill=1, stroke=0)


# ─── Page Number Callback ───
def add_page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont('NotoSans', 8)
    canvas.setFillColor(CBA_MUTED)
    # Page number bottom center
    page_num = canvas.getPageNumber()
    if page_num > 1:  # Skip cover
        canvas.drawCentredString(PAGE_W / 2, 15 * mm, f'— {page_num - 1} —')
    # Footer text
    canvas.setFont('NotoSans', 7)
    canvas.drawString(MARGIN_L, 12 * mm, 'Relatório de Prestação de Contas — CBA')
    canvas.drawRightString(PAGE_W - MARGIN_R, 12 * mm, 'Julho 2026')
    canvas.restoreState()


# ─── Build document ───
output_path = '/home/z/my-project/download/Relatorio_Prestacao_Contas_CBA.pdf'

doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    leftMargin=MARGIN_L,
    rightMargin=MARGIN_R,
    topMargin=MARGIN_T,
    bottomMargin=MARGIN_B,
    title='Relatório de Prestação de Contas e Entrega Técnica — CBA',
    author='Hermenegildo José Pombal',
    subject='Construção e Lançamento do Site Oficial da CBA',
    creator='CBA — Convenção Baptista de Angola',
)

# Create templates: full-page for cover, normal for body
cover_frame = Frame(0, 0, PAGE_W, PAGE_H, leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0, id='cover')
body_frame = Frame(MARGIN_L, MARGIN_B, CONTENT_W, PAGE_H - MARGIN_T - MARGIN_B, id='body')

cover_template = PageTemplate(id='Cover', frames=[cover_frame], onPage=add_page_number)
body_template = PageTemplate(id='Body', frames=[body_frame], onPage=add_page_number)
doc.addPageTemplates([cover_template, body_template])

story = []

# ═══ COVER PAGE ═══
story.append(NextPageTemplate('Body'))
story.append(CoverPage())
story.append(PageBreak())

# ═══ SECTION 1: INTRODUÇÃO ═══
story.append(Paragraph('1. Introdução e Objectivo', style_h1))
story.append(SectionDivider())
story.append(Spacer(1, 10))

story.append(Paragraph(
    'O presente relatório tem por objectivo apresentar à Direcção da Convenção Baptista de Angola (CBA) '
    'a prestação de contas referente aos fundos depositados para a aquisição do domínio do site oficial '
    'da instituição, bem como a entrega formal e conclusão do projecto de construção da plataforma digital.',
    style_body))

story.append(Paragraph(
    'Foi depositado na conta do desenvolvedor, Hermenegildo José Pombal, o montante de 100.000,00 Kz '
    '(cem mil Kwanzas) com a finalidade de adquirir o domínio de internet para o site da CBA. Após análise '
    'comparativa entre as opções de domínios disponíveis no mercado nacional angolano (.ao) e internacional '
    '(.org), optou-se pela aquisição do domínio <b>cbaangola.org</b> junto da empresa Hostinger, por razões '
    'de acessibilidade de custos e facilidade de pagamento.',
    style_body))

story.append(Paragraph(
    'Este documento detalha a utilização financeira dos recursos, a justificação técnica da escolha do '
    'domínio, a descrição completa do trabalho entregue e a proposta de devolução do saldo remanescente.',
    style_body))

# ═══ SECTION 2: PRESTAÇÃO DE CONTAS ═══
story.append(Paragraph('2. Prestação de Contas Financeira', style_h1))
story.append(SectionDivider())
story.append(Spacer(1, 10))

story.append(Paragraph(
    'Abaixo apresenta-se o detalhe financeiro dos valores recebidos, convertidos e utilizados para a '
    'aquisição do domínio. O montante original em Kwanzas foi convertido em Euros para possibilitar a '
    'compra junto de um fornecedor internacional, dada a impossibilidade de pagamento em Kwanzas junto '
    'da maioria dos fornecedores internacionais.',
    style_body))

story.append(Spacer(1, 6))

# Financial table
fin_data = [
    [Paragraph('<b>Descrição</b>', style_table_header),
     Paragraph('<b>Valor (Kz)</b>', style_table_header),
     Paragraph('<b>Valor (EUR)</b>', style_table_header)],
    [Paragraph('Valor recebido (depósito da CBA)', style_table_cell),
     Paragraph('100.000,00', style_table_cell_right),
     Paragraph('—', style_table_cell_right)],
    [Paragraph('Conversão para EUR (taxa aproximada)', style_table_cell),
     Paragraph('100.000,00', style_table_cell_right),
     Paragraph('≈ 101,00 €', style_table_cell_right)],
    [Paragraph('Compra do domínio cbaangola.org (Hostinger)', style_table_cell),
     Paragraph('85.639,00', style_table_cell_right),
     Paragraph('≈ 86,49 €', style_table_cell_right)],
    [Paragraph('<b>Saldo remanescente</b>', style_table_cell_bold),
     Paragraph('<b>14.361,00</b>', style_table_cell_right),
     Paragraph('<b>≈ 14,51 €</b>', style_table_cell_right)],
]

fin_table = Table(fin_data, colWidths=[CONTENT_W * 0.50, CONTENT_W * 0.25, CONTENT_W * 0.25])
fin_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), CBA_GREEN),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('FONTNAME', (0, 0), (-1, 0), 'NotoSans-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 9.5),
    ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ROWBACKGROUNDS', (0, 1), (-1, -2), [WHITE, CBA_LIGHT_BG]),
    ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#fef3c7')),
    ('GRID', (0, 0), (-1, -1), 0.5, CBA_BORDER),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
]))
story.append(fin_table)

story.append(Spacer(1, 12))
story.append(Paragraph(
    '<b>Nota:</b> Os valores em EUR são aproximados, sujeitos à taxa de câmbio do dia da transação. '
    'O saldo remanescente de <b>14.361,00 Kz</b> está disponível para devolução à CBA, conforme detalhado '
    'na Secção 5 deste relatório.',
    style_body))

# ═══ SECTION 3: ANÁLISE .ao vs .org ═══
story.append(Paragraph('3. Análise Comparativa: Domínios .ao vs .org', style_h1))
story.append(SectionDivider())
story.append(Spacer(1, 10))

story.append(Paragraph(
    'Antes da aquisição do domínio, foi realizada uma análise comparativa entre as opções de registos '
    'de domínios disponíveis no mercado nacional angolano (.ao) e no mercado internacional (.org). '
    'Abaixo apresentam-se os fornecedores angolanos consultados, com respectivos preços e formas de '
    'pagamento, bem como a comparação com a opção internacional escolhida.',
    style_body))

story.append(Spacer(1, 6))

# Comparison table
comp_data = [
    [Paragraph('<b>Fornecedor</b>', style_table_header),
     Paragraph('<b>Domínio</b>', style_table_header),
     Paragraph('<b>Preço/ano</b>', style_table_header),
     Paragraph('<b>Pagamento</b>', style_table_header)],
    # Angolan providers
    [Paragraph('DNS Angola\n(dnsao.com)', style_table_cell),
     Paragraph('.ao', style_table_cell),
     Paragraph('~15.000 Kz', style_table_cell_right),
     Paragraph('Multicaixa, Transferência', style_table_cell)],
    [Paragraph('Webtica\n(webtica.ao)', style_table_cell),
     Paragraph('.ao', style_table_cell),
     Paragraph('~18.000 Kz', style_table_cell_right),
     Paragraph('Multicaixa Express, BA Directo', style_table_cell)],
    [Paragraph('NBits\n(nbits.ao)', style_table_cell),
     Paragraph('.ao', style_table_cell),
     Paragraph('~20.000 Kz', style_table_cell_right),
     Paragraph('Multicaixa, Transferência', style_table_cell)],
    [Paragraph('Angola Online\n(angolaonline.net)', style_table_cell),
     Paragraph('.ao', style_table_cell),
     Paragraph('~25.000 Kz', style_table_cell_right),
     Paragraph('Multicaixa, Numerário', style_table_cell)],
    [Paragraph('Hostinger Angola\n(hostinger.ao)', style_table_cell),
     Paragraph('.ao', style_table_cell),
     Paragraph('~22.000 Kz', style_table_cell_right),
     Paragraph('Multicaixa Express', style_table_cell)],
    # International
    [Paragraph('Hostinger\n(hostinger.com)', style_table_cell_bold),
     Paragraph('.org', style_table_cell_bold),
     Paragraph('~8.980 Kz', style_table_cell_right),
     Paragraph('Cartão Visa/EUR', style_table_cell)],
]

comp_table = Table(comp_data, colWidths=[CONTENT_W * 0.28, CONTENT_W * 0.12, CONTENT_W * 0.25, CONTENT_W * 0.35])
comp_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), CBA_GREEN),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('FONTNAME', (0, 0), (-1, 0), 'NotoSans-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 9.5),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ROWBACKGROUNDS', (0, 1), (-1, -2), [WHITE, CBA_LIGHT_BG]),
    ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor('#dcfce7')),
    ('GRID', (0, 0), (-1, -1), 0.5, CBA_BORDER),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
]))
story.append(comp_table)

story.append(Spacer(1, 12))
story.append(Paragraph(
    '<b>Justificação da escolha:</b> O domínio <b>cbaangola.org</b> foi seleccionado pelos seguintes motivos:',
    style_body_bold))

just_points = [
    'Custo significativamente inferior (~8.980 Kz/ano vs ~15.000-25.000 Kz/ano para .ao);',
    'O domínio .org é internacionalmente reconhecido como adequado para organizações e instituições;',
    'A extensão .ao, embora nacional, apresentava custos superiores e, em alguns fornecedores, processos de registo mais demorados;',
    'O alojamento web (gratuito na Vercel) é compatível com qualquer extensão de domínio.',
]
for point in just_points:
    story.append(Paragraph(f'• {point}', ParagraphStyle('Bullet', parent=style_body, leftIndent=15, spaceAfter=4)))

# ═══ SECTION 4: ENTREGA TÉCNICA ═══
story.append(PageBreak())
story.append(Paragraph('4. Entrega Técnica do Projecto', style_h1))
story.append(SectionDivider())
story.append(Spacer(1, 10))

story.append(Paragraph(
    'O site oficial da Convenção Baptista de Angola foi construído utilizando tecnologias modernas e '
    'padrões internacionais de desenvolvimento web. O projecto encontra-se <b>concluído, testado e '
    'prontamente funcional</b>, acessível através do endereço <b>https://www.cbaangola.org</b>.',
    style_body))

story.append(Paragraph('4.1 Tecnologias Utilizadas', style_h2))

tech_data = [
    [Paragraph('<b>Componente</b>', style_table_header),
     Paragraph('<b>Tecnologia</b>', style_table_header),
     Paragraph('<b>Custo</b>', style_table_header)],
    [Paragraph('Framework do site', style_table_cell),
     Paragraph('Next.js 16 (React)', style_table_cell),
     Paragraph('Gratuito', style_table_cell_right)],
    [Paragraph('Base de dados', style_table_cell),
     Paragraph('PostgreSQL (Supabase)', style_table_cell),
     Paragraph('Gratuito', style_table_cell_right)],
    [Paragraph('Armazenamento de imagens', style_table_cell),
     Paragraph('Supabase Storage', style_table_cell),
     Paragraph('Gratuito', style_table_cell_right)],
    [Paragraph('Alojamento web', style_table_cell),
     Paragraph('Vercel (plano gratuito)', style_table_cell),
     Paragraph('Gratuito', style_table_cell_right)],
    [Paragraph('Domínio', style_table_cell),
     Paragraph('cbaangola.org (Hostinger)', style_table_cell),
     Paragraph('~8.980 Kz/ano', style_table_cell_right)],
    [Paragraph('Certificado SSL (HTTPS)', style_table_cell),
     Paragraph('Let\'s Encrypt (automático)', style_table_cell),
     Paragraph('Gratuito', style_table_cell_right)],
]

tech_table = Table(tech_data, colWidths=[CONTENT_W * 0.30, CONTENT_W * 0.45, CONTENT_W * 0.25])
tech_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), CBA_GREEN),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('FONTNAME', (0, 0), (-1, 0), 'NotoSans-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 9.5),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, CBA_LIGHT_BG]),
    ('GRID', (0, 0), (-1, -1), 0.5, CBA_BORDER),
    ('TOPPADDING', (0, 0), (-1, -1), 5),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
    ('LEFTPADDING', (0, 0), (-1, -1), 6),
    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
]))
story.append(tech_table)

story.append(Spacer(1, 12))
story.append(Paragraph('4.2 Funcionalidades Entregues', style_h2))

features = [
    '<b>Página Inicial</b> — com banner principal, avisos urgentes, matéria em destaque e publicações recentes;',
    '<b>Notícias</b> — sistema completo de notícias com filtros por categoria (Notícia, Evento, Seminário, Conferência, Encontro);',
    '<b>Publicações</b> — artigos, devocionais, revista EBD, com autor, resumo e conteúdo completo. 12 categorias disponíveis;',
    '<b>Departamentos</b> — 9 departamentos da CBA com cards visuais e páginas de detalhe;',
    '<b>Galeria de Eventos</b> — galeria fotográfica com visualizador em ecrã completo (lightbox);',
    '<b>Encontre Uma Igreja</b> — 52 igrejas registadas, organizadas por 10 províncias, com pesquisa integrada;',
    '<b>Quem Somos</b> — 7 secções editáveis (Visão e Valores, Historial, Declaração Doutrinária, Pacto, Baptistas, Estatuto, Plano Estratégico);',
    '<b>Contactos</b> — formulário funcional que guarda mensagens na base de dados; horário de funcionamento do escritório;',
    '<b>Doações</b> — sistema de doações com 3 categorias, IBAN, e envio de comprovativos;',
    '<b>Página Online</b> — player de YouTube incorporado com chat ao vivo para transmissões de cultos;',
    '<b>Botão Flutuante de Live</b> — botão vermelho activável pelo administrador quando há culto em directo;',
    '<b>Painel Administrativo</b> — gestão completa de todo o conteúdo do site, com 13 secções (Avisos, Notícias, Publicações, Galeria, Igrejas, Departamentos, Quem Somos, Contactos, Doações, Mensagens, Comprovativos, Definições, Dashboard);',
    '<b>Sistema de Upload</b> — upload de imagens e documentos PDF directamente pelo painel admin, com compressão automática;',
    '<b>PWA (App Instalável)</b> — o site pode ser instalado no telemóvel como uma aplicação, com ícone no ecrã inicial;',
    '<b>Navegação Mobile</b> — barra de navegação inferior fixa (estilo app) e menu hamburger com ícones SVG;',
    '<b>Vídeos</b> — suporte a vídeos do YouTube e Vimeo incorporados em notícias e publicações;',
    '<b>Responsivo</b> — site totalmente adaptado a telemóveis, tablets e computadores;',
    '<b>SEO e Performance</b> — optimização de imagens, cache, lazy loading, e metadados para motores de busca.',
]

for feat in features:
    story.append(Paragraph(f'• {feat}', ParagraphStyle('FeatBullet', parent=style_body, leftIndent=15, spaceAfter=4, fontSize=10)))

# ═══ SECTION 5: DEVOLUÇÃO DO SALDO ═══
story.append(PageBreak())
story.append(Paragraph('5. Devolução do Saldo Remanescente', style_h1))
story.append(SectionDivider())
story.append(Spacer(1, 10))

story.append(Paragraph(
    'Após a aquisição do domínio <b>cbaangola.org</b> e a conclusão de todas as despesas inerentes ao '
    'projecto, verificou-se um <b>saldo remanescente de 14.361,00 Kz</b> (catorze mil, trezentos e '
    'sessenta e um Kwanzas), proveniente da diferença entre o valor depositado (100.000,00 Kz) e o '
    'custo efectivo do domínio.',
    style_body))

story.append(Paragraph(
    'O referido valor encontra-se à disposição para devolução à Convenção Baptista de Angola, através '
    'de uma das seguintes modalidades, aguardando indicação da Direcção sobre a forma preferida:',
    style_body))

story.append(Spacer(1, 8))

# Options table
opt_data = [
    [Paragraph('<b>Modalidade</b>', style_table_header),
     Paragraph('<b>Detalhes</b>', style_table_header)],
    [Paragraph('Transferência Bancária', style_table_cell_bold),
     Paragraph('Transferência para conta bancária indicada pela CBA', style_table_cell)],
    [Paragraph('Entrega em Mão', style_table_cell_bold),
     Paragraph('Entrega física do valor em numerário, em local e data a acordar', style_table_cell)],
    [Paragraph('Multicaixa Express', style_table_cell_bold),
     Paragraph('Envio via Multicaixa Express para número de telefone indicado', style_table_cell)],
]

opt_table = Table(opt_data, colWidths=[CONTENT_W * 0.30, CONTENT_W * 0.70])
opt_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), CBA_GREEN),
    ('TEXTCOLOR', (0, 0), (-1, 0), WHITE),
    ('FONTNAME', (0, 0), (-1, 0), 'NotoSans-Bold'),
    ('FONTSIZE', (0, 0), (-1, -1), 9.5),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [WHITE, CBA_LIGHT_BG]),
    ('GRID', (0, 0), (-1, -1), 0.5, CBA_BORDER),
    ('TOPPADDING', (0, 0), (-1, -1), 6),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ('RIGHTPADDING', (0, 0), (-1, -1), 8),
]))
story.append(opt_table)

story.append(Spacer(1, 12))
story.append(Paragraph(
    '<b>Aguarda-se feedback</b> da Direcção sobre a modalidade preferida para que a devolução seja '
    'efectuada atempadamente.',
    style_body_bold))

# ═══ SECTION 6: CONCLUSÃO ═══
story.append(Paragraph('6. Conclusão', style_h1))
story.append(SectionDivider())
story.append(Spacer(1, 10))

story.append(Paragraph(
    'O projecto de construção do site oficial da Convenção Baptista de Angola encontra-se <b>concluído '
    'com sucesso</b>, com todas as funcionalidades planeadas implementadas, testadas e operacionais. '
    'O site está acessível ao público no endereço <b>https://www.cbaangola.org</b>, com certificado de '
    'segurança SSL, painel administrativo completo, e capacidade de instalação como aplicação no '
    'telemóvel.',
    style_body))

story.append(Paragraph(
    'A gestão integral do conteúdo do site — incluindo notícias, publicações, igrejas, departamentos, '
    'avisos, galeria, definições e demais elementos — pode ser realizada autonomamente pela Direcção '
    'através do painel administrativo em <b>https://www.cbaangola.org/#/admin</b>, sem necessidade de '
    'conhecimentos técnicos avançados.',
    style_body))

story.append(Paragraph(
    'Os custos de manutenção anual são minimizados, resumindo-se apenas à renovação do domínio '
    '(aproximadamente 8.980 Kz/ano), uma vez que o alojamento, a base de dados e o armazenamento de '
    'imagens são fornecidos gratuitamente pelas plataformas Vercel e Supabase.',
    style_body))

story.append(Paragraph(
    'O saldo remanescente de 14.361,00 Kz está disponível para devolução imediata, aguardando-se '
    'apenas a indicação da modalidade preferida pela Direcção.',
    style_body))

story.append(Spacer(1, 20))

# Signature block
story.append(HRFlowable(width=60*mm, thickness=1, color=CBA_BORDER, hAlign='CENTER', spaceBefore=20, spaceAfter=8))
story.append(Paragraph('Hermenegildo José Pombal', style_signature))
story.append(Paragraph('Desenvolvedor do Projecto', ParagraphStyle('SigRole', parent=style_signature, fontName='NotoSans', fontSize=9, textColor=CBA_MUTED, spaceBefore=0)))
story.append(Paragraph('Luanda, Julho de 2026', ParagraphStyle('SigDate', parent=style_signature, fontName='NotoSans', fontSize=9, textColor=CBA_MUTED, spaceBefore=2)))

# ═══ BUILD ═══
doc.build(story, onFirstPage=add_page_number, onLaterPages=add_page_number)
print(f'✅ PDF gerado: {output_path}')
print(f'   Tamanho: {os.path.getsize(output_path) / 1024:.1f} KB')
