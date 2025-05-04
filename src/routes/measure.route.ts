import { Router } from 'express';
import { PostUploadMeasureController } from '../controllers/measures/post_upload_measure.controller';
import { PatchConfirmOrCorrectMeasureController } from '../controllers/measures/patch_confirm_or_correct_measure.controller';
import { GetMeasuresController } from '../controllers/measures/get_measures.controller';

const router = Router();

router.post('/upload', PostUploadMeasureController);
router.patch('/confirm', PatchConfirmOrCorrectMeasureController);
router.get('/:customer_code/list', GetMeasuresController);

export default router;
