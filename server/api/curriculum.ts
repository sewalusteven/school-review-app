import {Prisma, PrismaClient} from "@prisma/client";
import express from 'express';
const router = express.Router();


const prisma = new PrismaClient()



router.get('',  (req, res) => {


    prisma.curriculum.findMany({
        include: {
            levels: true
        },
    }).then( curriculums => {
        res.status(200).send(curriculums)

    }).catch(err => {
        res.status(501).send(err)
    })


})
router.post('',  ({ body }, res) => {

    let payload: Prisma.CurriculumCreateInput = {
        name: body.name,
        description: body.description
    }

    prisma.curriculum.create({
        data: payload,
        include: {
            levels: true
        }
    }).then(createdCurriculum => {

        const addedLevels: Prisma.AcademicLevelCreateInput = body.levels.map((l: string) => {
            return {
                level: l,
                curriculum: {
                    connect: {
                        id: createdCurriculum.id
                    }
                }
            }
        })

        prisma.academicLevel.createMany({
            data:addedLevels
        }).then(() => {
            res.status(201).json({
                data: createdCurriculum,
                message: "Curriculum Created Successfully!"
            })
        }).catch(e => {
            res.status(501).json({message: e })
        })


    }).catch(e => {
        res.status(501).json({message: e })
    })


})
router.put('/:id',  ({ body, params }, res) => {

    let payload: Prisma.CurriculumUpdateInput= {
        name: body.name,
        description: body.description
    }


    prisma.curriculum.update({
        where: {
            id: Number(params.id)
        },
        include:{
           levels:true
        },
        data: payload
    }).then(r => {
        res.status(201).json({
            data: r,
            message: "Curriculum Updated Successfully!"
        })
    }).catch(e => {
        res.status(501).json({message: e})
    })

})
router.get('/:id',  ({params }, res) => {

    prisma.curriculum.findUniqueOrThrow({
        where: {
            id: Number(params.id)
        },
        include: {
            levels: true
        }
    }).then(r => {
        res.status(200).json(r)
    }).catch(e => {
        res.status(404).json({message: e})
    })
})

router.delete('/:id',  ({ params }, res) => {

    prisma.curriculum.delete({
        where: {
            id: Number(params.id)
        }
    }).then(r => {
        res.status(200).json({
            message: r.name + "has been successfully deleted"
        })
    }).catch(e => {
        res.status(404).json({message: e})
    })
})

export default router;