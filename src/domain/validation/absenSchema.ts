import { z } from 'zod';

export const absenMasukSchema = z.object({
  nidn: z.string(),
  tanggal: z.string().pipe(z.coerce.date()),
  absen_masuk: z.string(),
  lat: z.string(),
  long: z.string(),
});

export const absenKeluarSchema = z.object({
    nidn: z.string(),
    tanggal: z.string().pipe(z.coerce.date()),
    absen_keluar: z.string(),
});