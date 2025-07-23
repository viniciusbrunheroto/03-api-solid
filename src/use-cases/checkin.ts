import { UsersRepository } from "@/repositories/users-repository";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { compare } from "bcryptjs";
import { CheckIn, User } from "generated/prisma";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordinates";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";
import { MaxDistanceError } from "./errors/max-distance-error";


interface CheckInUseCaseRequest {
   userId: string
   gymId: string
   userLatitude: number
   userLongitude: number
}

interface CheckInUseCaseResponse {
    checkin: CheckIn
}

export class CheckInUseCase {
    constructor(
        private CheckInsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository,
    ) {}


    async execute({userId, gymId, userLatitude, userLongitude}: CheckInUseCaseRequest):
     Promise<CheckInUseCaseResponse> {

        const gym = await this.gymsRepository.findById(gymId)

        if(!gym) {
            throw new ResourceNotFoundError()
        }

        const distance = getDistanceBetweenCoordinates(
            {
                latitude: userLatitude,
                longitude: userLongitude
            },
            {
                latitude: gym.latitude.toNumber(),
                longitude: gym.longitude.toNumber()
            }
        )

        const MAX_DISTANCE_IN_KILOMETERS= 0.1

        if (distance > MAX_DISTANCE_IN_KILOMETERS) {
            throw new MaxDistanceError()
        }

     
        const checkInOnSameDate = await this.CheckInsRepository.findByUserIdOnDate(
            userId,
            new Date(),
        )

        if (checkInOnSameDate) {
            throw new MaxNumberOfCheckInsError()
        }

          const checkin = await this.CheckInsRepository.create({
                gym_id: gymId,
                user_id: userId,
          })
            return {
                checkin,
            }
    }
}