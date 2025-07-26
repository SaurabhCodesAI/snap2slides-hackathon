import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface HistoryItem {
  id: string;
  title: string;
  timestamp: string;
  slideCount: number;
  thumbnail?: string;
}

// Mock history data for development
const mockHistory: HistoryItem[] = [
  {
    id: '1',
    title: 'Project Kickoff Meeting',
    timestamp: '2024-01-15T10:00:00Z',
    slideCount: 8,
    thumbnail: '/api/placeholder/200/150'
  },
  {
    id: '2', 
    title: 'Q4 Financial Review',
    timestamp: '2024-01-10T14:30:00Z',
    slideCount: 12,
    thumbnail: '/api/placeholder/200/150'
  }
];

export async function GET(request: NextRequest) {
  try {
    // In production, this would query your database
    // For now, return mock data
    return NextResponse.json({ 
      success: true, 
      history: mockHistory 
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
