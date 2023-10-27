import * as AWS from 'aws-sdk';
import { S3Client ,GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config();

class AmazonS3 {
    private awsAccessKeyId = `${process.env.AWSACCESSKEYID}`;
    private awsSecretAccessKey =`${process.env.AWSSECRETACCESSKEY}` 
    private regionName =process.env.REGIONNAME ;
    private s3BucketName = 'my-bucket-create-from-program';
    private s3ObjectKey = 'image3'; // Specify the object key in your S3 bucket
    private s3:AWS.S3;
    private s3Client:S3Client;
    // private imageUrl = 'https://www.edamam.com/food-img/90d/90dcfa94f6d38aea879fdf50322b6524.jpg';
    constructor(){

        this.s3 = new AWS.S3({
          accessKeyId: this.awsAccessKeyId,
          secretAccessKey: this.awsSecretAccessKey,
          region: this.regionName,
        });
        this.s3Client=new S3Client({
          region: this.regionName,
          credentials:{
            accessKeyId: this.awsAccessKeyId,
            secretAccessKey: this.awsSecretAccessKey,
          }
        });
    }
    public createBucket(){
        this.s3.createBucket({
            Bucket:'my-bucket-create-from-program'
        },(error:any,success:any)=>{
            if(error) {
                console.log("error------------------",error);
            }else {
                console.log("success----------",success);
            }
        })
    }
    
    public async uploadImageToS3(imageUrl:any) {
      try {
        // Download the image through the url in buffer form 
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageData = response.data;
    
        // Uploading image to the s3 Bucket 
        console.log( "Image data here -------> " , imageData);
        await this.s3.putObject({
            Bucket: this.s3BucketName,
            Key: this.s3ObjectKey,//file name that we want
            Body: imageData,
            ContentType: 'image/jpg', // Adjust the content type if necessary
          },(error:any,success:any)=>{
            if(error) {
                console.log(error)
            }else {
                console.log(success);
            }
          })
          
        console.log(`Image uploaded to S3 bucket: ${this.s3BucketName} as ${this.s3ObjectKey}`);
      } catch (error) {
        console.error('Error uploading the image:', error);
      }
    }
    public async getPresignedUrl<T extends string | undefined>(key:T) {
      const command = new GetObjectCommand({
        Bucket: "shashank-private",
        Key: key
      })
      const url=await getSignedUrl(this.s3Client,command);//{expiresIn:20}
      console.log(url);
    }
    public async getImage(){
      let params = {
        "Bucket": "my-bucket-create-from-program",
        "Key": "image3"  
          };
      this.s3.getObject(params, (error, data) => {
        if (error)
          throw error;
        console.log(data.Body);
      })
    }
}

export const amazonS3 = new AmazonS3();