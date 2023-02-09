const { StatusCodes } = require('http-status-codes');
const path = require('path');
const CustomError = require('../errors');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const uploadProductImage = async (req, res) => {
  console.log(req.files);

  // const result = await cloudinary.uploader.upload(
  //   req.files.images.tempFilePath,
  //   {
  //     use_filename: true,
  //     folder: 'file-upload'
  //   }
  // );

  // fs.unlinkSync(req.files.images.tempFilePath);

  res.end();
  // res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = uploadProductImage;
