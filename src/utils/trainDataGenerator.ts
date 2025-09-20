import { Train, JobCardStatus, RiskLevel } from '../types/train';

const TRAIN_NAMES = [
  'KRISHNA', 'TAPTI', 'NILA', 'GANGA', 'YAMUNA', 'KAVERI', 'GODAVARI', 'NARMADA',
  'CHENAB', 'RAVI', 'BEAS', 'SUTLEJ', 'INDUS', 'BRAHMAPUTRA', 'MAHANADI',
  'TUNGABHADRA', 'KOSI', 'GHAGHRA', 'GANDAK', 'CHAMBAL', 'BETWA', 'SON',
  'DAMODAR', 'PAVAN', 'MAARUT'
];

const JOB_CARD_STATUSES: JobCardStatus[] = ['Open', 'Pending', 'Appointed', 'Verified', 'Closed'];

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function calculateRiskLevel(expiryDate: Date, jobCardStatus: JobCardStatus): { level: RiskLevel; score: number } {
  const now = new Date();
  const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const isExpired = daysUntilExpiry <= 0;
  const isHighRiskStatus = jobCardStatus === 'Open' || jobCardStatus === 'Pending';

  if (isExpired || (daysUntilExpiry <= 3 && isHighRiskStatus)) {
    return { level: 'Critical', score: 100 };
  } else if (daysUntilExpiry <= 3 || (daysUntilExpiry <= 7 && isHighRiskStatus)) {
    return { level: 'High', score: 75 };
  } else if (daysUntilExpiry <= 7 || isHighRiskStatus) {
    return { level: 'Medium', score: 50 };
  } else {
    return { level: 'Low', score: 25 };
  }
}

function calculateMCDA(riskScore: number, cleanlinessScore: number, mileage: number): number {
  return 0.3 * riskScore + 0.3 * cleanlinessScore + 0.4 * (mileage / 1000);
}

function calculateBayPriority(train: Train): number {
  const riskWeight = { Critical: 1000, High: 750, Medium: 500, Low: 250 }[train.risk_level];
  const now = new Date();
  const daysUntilExpiry = Math.max(0, Math.ceil((train.expiry_date.getTime() - now.getTime()) / (1000 * 3600 * 24)));
  const expiryWeight = Math.max(0, 100 - daysUntilExpiry);
  const jobWeight = { Open: 100, Pending: 80, Appointed: 60, Verified: 40, Closed: 20 }[train.jobcard_status];
  const mileageWeight = train.mileage / 1000;
  const daysSinceInspection = Math.ceil((now.getTime() - train.last_inspection_date.getTime()) / (1000 * 3600 * 24));
  const inspectionWeight = Math.min(daysSinceInspection, 365);

  return riskWeight + expiryWeight + jobWeight + mileageWeight + inspectionWeight;
}

export function generateTrainData(): Train[] {
  const trains: Train[] = [];
  const now = new Date();
  
  for (let i = 0; i < 25; i++) {
    const trainNumber = (i + 1).toString().padStart(2, '0');
    const trainName = TRAIN_NAMES[i];
    
    // Generate random dates
    const issueDate = randomDate(new Date(2020, 0, 1), new Date(2024, 11, 31));
    const expiryDate = randomDate(new Date(2024, 0, 1), new Date(2026, 11, 31));
    const lastInspectionDate = randomDate(new Date(2023, 0, 1), now);
    
    const jobCardStatus = JOB_CARD_STATUSES[Math.floor(Math.random() * JOB_CARD_STATUSES.length)];
    const cleanlinessScore = Math.floor(Math.random() * 61) + 40; // 40-100
    const mileage = Math.floor(Math.random() * 90001) + 10000; // 10,000-100,000
    const dailyCrowdCount = Math.floor(Math.random() * 4501) + 500; // 500-5000
    
    const { level: riskLevel, score: riskScore } = calculateRiskLevel(expiryDate, jobCardStatus);
    const mcdaScore = calculateMCDA(riskScore, cleanlinessScore, mileage);
    
    const train: Train = {
      train_number: trainNumber,
      train_name: trainName,
      issue_date: issueDate,
      expiry_date: expiryDate,
      jobcard_status: jobCardStatus,
      risk_level: riskLevel,
      risk_score: riskScore,
      cleanliness_score: cleanlinessScore,
      mileage: mileage,
      mcda_score: mcdaScore,
      daily_crowd_count: dailyCrowdCount,
      last_inspection_date: lastInspectionDate,
      bay_priority: 0
    };
    
    train.bay_priority = calculateBayPriority(train);
    trains.push(train);
  }
  
  return trains;
}