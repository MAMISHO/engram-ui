import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'sessions',
  timestamps: false,
})
export class SessionModel extends Model {
  @Column({
    type: DataType.TEXT,
    primaryKey: true,
  })
  declare id: string;

  @Column(DataType.TEXT)
  declare project: string;

  @Column(DataType.TEXT)
  declare directory: string;

  @Column({
    type: DataType.TEXT,
    field: 'started_at',
  })
  declare startedAt: string;

  @Column({
    type: DataType.TEXT,
    field: 'ended_at',
  })
  declare endedAt: string;

  @Column(DataType.TEXT)
  declare summary: string;
}
