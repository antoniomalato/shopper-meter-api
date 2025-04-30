import { Router } from 'express';
import { confirmMeasure, listMeasures, uploadMeasure } from '../controllers/measure.controller';

const router = Router();

router.post('/upload', uploadMeasure);
router.patch('/confirm', confirmMeasure);
router.get('/:customerCode/list', listMeasures);

export default router;
