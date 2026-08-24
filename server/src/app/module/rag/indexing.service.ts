import { success } from "zod";
import { prisma } from "../../lib/prisma";
import { EmbeddingService } from "./embedding.service"

export class IndexingService {
    private embeddingService: EmbeddingService

    constructor() {
        this.embeddingService = new EmbeddingService();
    }
    async indexDocument(){
        
    }

    async indexDoctorData() {
        try {
            console.log("Fetching doctor data for indexing....");
            const doctors = await prisma.doctor.findMany({
                where: { isDeleted: false },
                include: {
                    specialties: {
                        include: {
                            specialty: true,
                        },
                    },
                    reviews: true,
                }
            });

            let indexingCount = 0;

            for (const doctor of doctors) {
                // Format specialties
                const specialtiesList = doctor.specialties.
                    map((ds) => ds.specialty.title)
                    .join("\n")

                // format reviews
                const reviewText = doctor.reviews.map(
                    (r) => `RAting: ${r.rating}/5. comment: ${r.comment} || "No comment"`,
                );

                const content = `Doctor Name: ${doctor.name}
                Experience: ${doctor.experience} years
                Qualification: ${doctor.qualifications}
                Designation: ${doctor.designation}
                Appointment Fee: $${doctor.appointmentFee}
                Current Working Place: ${doctor.currentWorkingPlace}
                Average Rating: ${doctor.averageRating}/5
                Specialties: ${specialtiesList || "None listed"}

                Patient Reviews:
                ${reviewsText || "No reviews yet."}`;

                const metadata = {
                    doctorId: doctor.id,
                    name: doctor.name,
                    specialties: doctor.specialties.map((ds) => ds.specialty.title),
                    averageRating: doctor.averageRating,
                    experience: doctor.experience,
                };

                const chunkKey = `doctor-${doctor.id}`;

                await this.indexDocument(
                    chunkKey,
                    "Doctor",
                    doctor.id,
                    doctor.name,
                    metadata,
                )

                indexedCount++;
            }

            console.log(`Successfully Indexed ${indexingCount} doctors.`);

            return{
                success: true,
                message: `Successfully Indexed ${indexingCount} doctors.`,
                indexingCount,
            }

        } catch (error) {
            console.log(error);
        }
    }
}