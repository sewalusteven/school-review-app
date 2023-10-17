import {Prisma, PrismaClient} from "@prisma/client";
import express from 'express';
const router = express.Router();

const perPage=20

const prisma = new PrismaClient()

const skip = (page:number, limit: number = perPage) => {
    return limit * (page - 1);
}

router.post('',  (req, res) => {

    let offset = (req.body.page)?skip(req.body.page):0;

    prisma.school.findMany({
        where: {
          deletedAt: null
        },
        include: {
            district: true,
            curriculum: true,
            academicLevel: true,
            photos: true,
            reviews: true,
            subjects: true
        },
        take: perPage,
        skip: offset
    }).then( schools => {
        prisma.school.count().then(total => {
            res.status(200).send({
                data: schools,
                currPage: req.body.page,
                perPage: perPage,
                totalItems: total
            })
        });

    }).catch(err => {
        res.status(501).send(err)
    })
})
router.post('/search',  (req, res) => {

    let offset = (req.body.page)?skip(req.body.page):0;

    prisma.school.findMany({
        where: {
          name: {
              startsWith: req.body.query
          }
        },
        include: {
            district: true,
            curriculum: true,
            academicLevel: true,
            photos: true,
            reviews: true,
            subjects: true
        },
        take: perPage,
        skip: offset
    }).then( schools => {
        prisma.school.count().then(total => {
            res.status(200).send({
                data: schools,
                currPage: req.body.page,
                perPage: perPage,
                totalItems: total
            })
        });

    }).catch(err => {
        res.status(501).send(err)
    })
})
router.post('/create',  ({ body }, res) => {

    let payload: Prisma.SchoolCreateInput = {
        name: body.name,
        address: body.address,
        district:{
            connect: {
                id: body.districtId
            }
        },
        about: body.about,
        history: body.history,
        phoneNumber: body.phoneNumber,
        email: body.email,
        curriculum: {
            connect: {
                id: body.curriculumId
            }
        },
        academicLevel: {
            connect: {
                id: body.academicLevelId
            }
        }
    }


    prisma.school.create({
        data: payload,
        include: {
            district: true,
            curriculum: true,
            academicLevel: true,
            photos: true,
            reviews: true,
            subjects: true
        }
    }).then(createdSchool => {
        res.status(201).json({
            data: createdSchool,
            message: "School Created Successfully!"
        })
    }).catch(e => {
        res.status(501).json({message: e })
    })


})
router.put('/:id',  ({ body, params }, res) => {

    let payload: Prisma.SchoolUpdateInput = {
        name: body?.name,
        address: body?.address,
        district:{
            connect: {
                id: body?.districtId
            }
        },
        about: body?.about,
        history: body?.history,
        phoneNumber: body?.phoneNumber,
        email: body?.email,
        curriculum: {
            connect: {
                id: body?.curriculumId
            }
        },
        academicLevel: {
            connect: {
                id: body?.academicLevelId
            }
        }
    }


    prisma.school.update({
        where: {
            id: Number(params.id)
        },
        include:{
            district: true,
            curriculum: true,
            academicLevel: true,
            photos: true,
            reviews: true,
            subjects: true
        },
        data: payload
    }).then(r => {
        res.status(201).json({
            data: r,
            message: "School Updated Successfully!"
        })
    }).catch(e => {
        res.status(501).json({message: e})
    })

})
router.get('/:id',  ({params }, res) => {

    prisma.school.findUniqueOrThrow({
        where: {
            id: Number(params.id),
            deletedAt: null
        },
        include: {
            district: true,
            curriculum: true,
            academicLevel: true,
            photos: true,
            reviews: true,
            subjects: true
        }
    }).then(r => {
        res.status(200).json({
            data: r
        })
    }).catch(e => {
        res.status(404).json({message: e})
    })
})

router.delete('/:id',  ({ params }, res) => {
    let now = new Date()

    prisma.school.update({
        where: {
            id: Number(params.id)
        },
        data: {
            deletedAt: now
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