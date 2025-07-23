import { CheckIn, Prisma } from "generated/prisma";

export interface CheckInsRepository {
    create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
    findById(id: string): Promise<CheckIn | null>
    findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
    countByUserId(userId: string): Promise<number>
    findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
    save(checkIn: CheckIn): Promise<CheckIn>
   
}