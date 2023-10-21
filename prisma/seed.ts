
import {PrismaClient} from "@prisma/client";
//import {secSchools, primarySchools} from "../server/datasets/schools";
import {ugandaDistricts} from "../server/datasets/districts";
import {primarySchools, secSchools} from "../server/datasets/schools";

const prisma = new PrismaClient()

async function  main(){
     await seedSecSchools()
}

function capitalizeFirstLetter(str: string):string {
    if (str.length === 0) {
        return str; // Return the input as is if it's not a string or an empty string.
    }

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}



const seedSecSchools =  async () => {

    for (const s of primarySchools) {


        const district =  await prisma.district.findFirstOrThrow({
            where: {
                name: capitalizeFirstLetter(s.district)
            }
        })

         await prisma.school.create({
            data: {
                name: s.school,
                phoneNumber: s.contact,
                districtId: district.id,
                curriculumId: 1,
                academicLevelId: 104

            }
        })
    }
}




main().catch(e => {
    console.log(e)
    process.exit(1)
}).finally(() => {
    prisma.$disconnect();
})
