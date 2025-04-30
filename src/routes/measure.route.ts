import { Router } from 'express';
import { confirmMeasure, listMeasures } from '../controllers/measure.controller';
import { UploadMeasure } from '../controllers/upload_measure_controller';

const router = Router();

router.post('/upload', UploadMeasure);
router.patch('/confirm', confirmMeasure);
router.get('/:customerCode/list', listMeasures);

export default router;
