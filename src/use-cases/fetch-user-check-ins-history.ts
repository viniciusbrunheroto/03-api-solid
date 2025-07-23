
import { CheckIn } from "generated/prisma";
import { CheckInsRepository } from "@/repositories/check-ins-repository";



interface FetchUserCheckInsHistoryUseCaseRequest {
   userId: string
   page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
    checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
    constructor(
        private CheckInsRepository: CheckInsRepository,
    ) {}


    async execute({userId, page}: FetchUserCheckInsHistoryUseCaseRequest):
     Promise<FetchUserCheckInsHistoryUseCaseResponse> {

        const checkIns = await this.CheckInsRepository.findManyByUserId(userId, page)

        
         return {
            checkIns,
         }
    }
}