export interface HourlyStat {
  date: Date;
  hour: number;
  impressions: number;
  clicks: number;
  revenue: string;

  poi_id: number;
  name: string;
}
