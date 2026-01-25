import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
class StockFeature {
  @PrimaryColumn()
  date: string;

  @PrimaryColumn()
  symbol: string;

  // --- Core Price & Volume ---
  @Column({ type: 'float' })
  volume: number;

  @Column({ type: 'float' })
  open: number;

  @Column({ type: 'float' })
  close: number;

  // --- Ratios & Moving Averages ---

  @Column({ type: 'float', nullable: true })
  price_change_ratio: number;

  @Column({ type: 'float', nullable: true })
  volume_mean_7_days_ratio: number;

  @Column({ type: 'float', nullable: true })
  volume_mean_20_days_ratio: number;

  @Column({ type: 'float', nullable: true })
  volume_mean_50_days_ratio: number;

  @Column({ type: 'float', nullable: true })
  MA7: number;

  @Column({ type: 'float', nullable: true })
  MA9: number;

  @Column({ type: 'float', nullable: true })
  MA14: number;

  @Column({ type: 'float', nullable: true })
  MA18: number;

  @Column({ type: 'float', nullable: true })
  MA20: number;

  @Column({ type: 'float', nullable: true })
  MA26: number;

  @Column({ type: 'float', nullable: true })
  MA50: number;

  @Column({ type: 'float', nullable: true })
  MA52: number;

  // --- Technical Indicators ---

  @Column({ type: 'float', nullable: true })
  RSI: number;

  @Column({ type: 'float', nullable: true })
  MACD: number;

  @Column({ type: 'float', nullable: true })
  MACD_signal: number;

  @Column({ type: 'float', nullable: true })
  MACD_hist: number;

  @Column({ type: 'float', nullable: true })
  Stoch_K: number;

  @Column({ type: 'float', nullable: true })
  Stoch_D: number;

  @Column({ type: 'float', nullable: true })
  ADX: number;

  @Column({ type: 'float', nullable: true })
  MFI: number;

  // --- Relationship Ratios ---

  @Column({ type: 'float', nullable: true })
  MA9_MA26_ratio: number;

  @Column({ type: 'float', nullable: true })
  MA9_MA50_ratio: number;

  @Column({ type: 'float', nullable: true })
  MA26_MA50_ratio: number;

  // --- Trend Indicators ---

  @Column({ type: 'float', nullable: true })
  MA9_trend: number;

  @Column({ type: 'float', nullable: true })
  MA26_trend: number;

  @Column({ type: 'float', nullable: true })
  MA50_trend: number;
}

export default StockFeature;
