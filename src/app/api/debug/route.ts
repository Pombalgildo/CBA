import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const results: any = {}
  
  try {
    results.siteSetting = await db.siteSetting.findUnique({ where: { id: 'main' } })
    results.siteSetting_ok = true
  } catch (e: any) {
    results.siteSetting_error = e.message
  }
  
  try {
    results.newsCount = await db.newsItem.count()
    results.news_ok = true
  } catch (e: any) {
    results.news_error = e.message
  }
  
  try {
    results.pubCount = await db.publication.count()
    results.pub_ok = true
  } catch (e: any) {
    results.pub_error = e.message
  }
  
  try {
    results.eventCount = await db.event.count()
    results.event_ok = true
  } catch (e: any) {
    results.event_error = e.message
  }
  
  try {
    results.churchCount = await db.church.count()
    results.church_ok = true
  } catch (e: any) {
    results.church_error = e.message
  }
  
  try {
    results.minCount = await db.ministry.count()
    results.min_ok = true
  } catch (e: any) {
    results.min_error = e.message
  }
  
  try {
    results.donCount = await db.donationCategory.count()
    results.don_ok = true
  } catch (e: any) {
    results.don_error = e.message
  }
  
  return NextResponse.json(results)
}
