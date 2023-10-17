
import {PrismaClient} from "@prisma/client";
import {secSchools} from "../server/datasets/schools";

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

    secSchools.forEach(s => {
        if(s.district === 'WAKISO'){
            prisma.district.findFirst({
                where: {
                    name: "Wakiso"
                }
            }).then(district => {
                prisma.school.create({
                    data: {
                        name: s.school,
                        district: {
                            connect: {
                                id: district?.id
                            }
                        }
                    }
                }).then(res => {
                    console.log('added')
                })
            })
        }
    })
}


main().catch(e => {
    console.log(e)
    process.exit(1)
}).finally(() => {
    prisma.$disconnect();
})
