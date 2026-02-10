
export interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export enum CalcMode {
  DEG = 'DEG',
  RAD = 'RAD'
}

export interface GraphDataPoint {
  x: number;
  y: number;
}
