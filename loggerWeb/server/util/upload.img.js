const multer = require('multer');
const fs = require('fs');


/** Image Upload */
const ImageUpload = (Dir) => {
    if (Dir) {
        var storage = multer.diskStorage({
            destination: (req, file, callback) => {
                var uploadDir = process.cwd() + '/UploadFolder/img/' + Dir;
                try {
                    fs.mkdirSync(uploadDir);
                } catch (e) {
                    if (e.code !== 'EEXIST') {
                        console.log('Image upload make folder error :::: ', e);
                        throw e;
                    }
                }
                callback(null, uploadDir);
            },
        });
        return multer({
            storage: storage,
            fileFilter: (req, file, callback) => {
                var getType = file.mimetype.split('/');
                fileType = getType[1];
                if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg' || fileType == 'gif') {
                    callback(null, true);
                } else {
                    req.validateErr = '<script>alert("not_image");</script>';
                    callback(null, false, new Error('not_image'));
                }
            }
        });

    } else {
        throw new Error('The parameter is omitted ... ');
    }
};

/*
const board_img_upload = (req, res, next) => {
    var upload = ImageUpload(req.session.info.id).single('upload');
    upload(req, res, (err) => {
        if (err) {
            if (err.code == 'LIMIT_FILE_SIZE') {
                upJsonData = {
                    "uploaded": 0,
                    "fileName": '',
                    "path": ''
                };
                var html;
                html = "";
                html += "<script type='text/javascript'>";
                html += " var funcNum = " + req.query.CKEditorFuncNum + ";";
                html += " var url = \"/images/" + upJsonData.path + "/" + upJsonData.fileName + "\";";
                html += " var message = \"too big file\";";
                html += " window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                html += "</script>";
                res.send(html);
                res.end('<script>alert("too big file");</script>');
            } else {
                return next(err);
            }
        } else if (req.validateErr) {
            const validateErr = req.validateErr;
            req.validateErr = '';
            upJsonData = {
                "uploaded": 0,
                "fileName": '',
                "path": ''
            };
            var html;
            html = "";
            html += "<script type='text/javascript'>";
            html += " var funcNum = " + req.query.CKEditorFuncNum + ";";
            html += " var url = \"/images/" + upJsonData.path + "/" + upJsonData.fileName + "\";";
            html += " var message = \"not image file\";";
            html += " window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
            html += "</script>";
            res.send(html);
            return res.end(validateErr);
        } else {
            upJsonData = {
                "uploaded": 1,
                "fileName": req.file.filename,
                "path": req.session.info.id
            };
            console.log('file size ::::: ', req.file.size);
            var html;
            html = "";
            html += "<script type='text/javascript'>";
            html += " var funcNum = " + req.query.CKEditorFuncNum + ";";
            html += " var url = \"/images/" + upJsonData.path + "/" + upJsonData.fileName + "\";";
            html += " var message = \"업로드 완료\";";
            html += " window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
            html += "</script>";
            res.send(html);

        }
    });


};
*/