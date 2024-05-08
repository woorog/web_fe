import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseTimeEntity {
  @CreateDateColumn({ name: 'created' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated' })
  updatedAt: Date;
}
