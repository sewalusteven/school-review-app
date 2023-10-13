import {subjects} from "../server/datasets/subjects";


import {Prisma, PrismaClient} from "@prisma/client";

const prisma = new PrismaClient()

async function  main(){
     await seedSubjects()
}

function capitalizeFirstLetter(str: string):string {
    if (str.length === 0) {
        return str; // Return the input as is if it's not a string or an empty string.
    }

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}



const seedSubjects =  async () => {
    for (const s of subjects) {
        await prisma.curriculum.findFirst({where: {
                name: s.curriculum
            }}).then(async res => {
            if(res !== null){
                let levels =  s.level.split(", ")
                for (const level of levels) {
                    await  prisma.academicLevel.findFirst({
                        where: {
                            level: level
                        }
                    }).then(async result => {
                        if(result !== null){
                            await prisma.subject.create({
                                data: {
                                    subject: s.subjectName,
                                    curriculumId: res.id,
                                    academicLevelId: result.id
                                }
                            })
                        }
                    })

                }
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
