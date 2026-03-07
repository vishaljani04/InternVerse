const router = require('express').Router();
const { auth, authorize } = require('../middleware/auth');
const {
    generateCertificate, getCertificates, getMyCertificates, downloadCertificate, deleteCertificate
} = require('../controllers/certificateController');

router.use(auth);

router.post('/generate', authorize('hr'), generateCertificate);
router.get('/', authorize('admin', 'hr'), getCertificates);
router.get('/my', authorize('intern'), getMyCertificates);
router.get('/:id/download', downloadCertificate);
router.delete('/:id', authorize('admin', 'hr'), deleteCertificate);

module.exports = router;
