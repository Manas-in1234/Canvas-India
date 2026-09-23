import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

const QC_RESULTS = ['PASS', 'FAIL', 'REWORK'];

export class QcResultDto {
  @IsIn(QC_RESULTS)
  printQuality!: 'PASS' | 'FAIL' | 'REWORK';

  @IsIn(QC_RESULTS)
  colorQuality!: 'PASS' | 'FAIL' | 'REWORK';

  @IsIn(QC_RESULTS)
  alignment!: 'PASS' | 'FAIL' | 'REWORK';

  @IsIn(QC_RESULTS)
  materialQuality!: 'PASS' | 'FAIL' | 'REWORK';

  @IsIn(QC_RESULTS)
  assemblyQuality!: 'PASS' | 'FAIL' | 'REWORK';

  @IsIn(QC_RESULTS)
  packagingQuality!: 'PASS' | 'FAIL' | 'REWORK';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  photos?: string[];
}
