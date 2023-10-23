import {Prisma, PrismaClient} from "@prisma/client";
import express, {Request} from 'express';
import multer from "multer";
import path from 'path';
import fs from 'fs';
const router = express.Router();


const perPage=20

const prisma = new PrismaClient()

const skip = (page:number, limit: number = perPage) => {
    return limit * (page - 1);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extname = path.extname(file.originalname);
        cb(null, uniqueSuffix + extname);
    },
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if(file === undefined){
        cb(null, false)
    }else if (file.size > 2000000) {
        cb(null, false)
    } else {
        cb(null, true);
    }
};

const upload = multer({ storage, fileFilter});

router.post("/upload",upload.single('image'), (req, res) => {
    if(req.file === undefined){
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const file = req.file;

    if (file.size > 2000000) {
        return res.status(400).send('Image size is too large');
    }

    if(req.body.type === 'Thumb'){
        prisma.schoolPhoto.findFirst({
            where: {
                schoolId: req.body.schoolId,
                type:'Thumb'
            }
        }).then(existingThumb => {
            if (existingThumb?.path && fs.existsSync(existingThumb.path)) {
                // Delete the file
                fs.unlinkSync(existingThumb.path);
            }

            prisma.schoolPhoto.create({
                data: {
                    path: file.path,
                    type: "Thumb",
                    schoolId: req.body.schoolId
                }
            }).then(msg => {
                res.send('School Badge uploaded successfully');
            })

        })
    }else {
        prisma.schoolPhoto.create({
            data: {
                path: file.path,
                type: req.body.type,
                schoolId: req.body.schoolId
            }
        }).then(msg => {
            res.send('Image uploaded successfully');
        })
    }



})
router.get("/count", (req, res) => {
    prisma.school.count().then(total => {
        res.status(201).json(total)
    });
})

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
        res.status(200).json(r)
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