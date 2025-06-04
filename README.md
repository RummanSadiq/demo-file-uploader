# 📸 Image Gallery with S3 Storage

A modern, responsive image gallery application built with Next.js 14, featuring automatic thumbnail generation, S3 storage integration, and a beautiful glassmorphism UI.

## ✨ Features

- **🖼️ Image Upload & Storage**: Upload images directly to AWS S3 with automatic thumbnail generation
- **🎨 Responsive Gallery**: Beautiful grid layout that adapts to all screen sizes
- **🔍 Full-Size Viewing**: Modal popup for viewing images at full resolution
- **⬇️ Download Support**: Download original images with pre-signed URLs
- **📱 Modern UI**: Dark theme with glassmorphism effects and smooth animations
- **⚡ Optimized Performance**: Next.js Image optimization and efficient S3 integration
- **🗄️ Database Integration**: PostgreSQL with Prisma ORM for metadata storage

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Storage**: AWS S3
- **Image Processing**: Sharp for thumbnail generation
- **UI Components**: Lucide React icons, custom components

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- PostgreSQL database
- AWS account with S3 bucket configured
- AWS credentials configured

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd image-gallery
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/image_gallery"

# AWS Configuration
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="your-s3-bucket-name"
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_ARCHITECTURE="false" // 'true' if deployed in aws architecture (ec2, ecs, etc.)
NODE_ENV="development"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate-client

# Run database migrations
npm run db:migrate

# Optional: Open Prisma Studio
npm run db:studio
```

### 4. AWS S3 Setup

1. Create an S3 bucket in your AWS console
2. Create 2 directories **thumbnails** and **full-resolution**
3. Uncheck block all public access
4. Configure bucket permissions for public read access (for thumbnails)

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadForThumbnailDirectory",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::<bucket-name>/thumbnails/*"
        }
    ]
}
```

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

Visit `http://localhost:3000` to see the application.


## 🔧 Configuration

### Database Schema (`prisma/schema.prisma`)

The application uses a simple `File` model to store image metadata:

- `id`: Unique identifier
- `name`: Original filename
- `size`: File size in bytes
- `type`: MIME type
- `thumbnailKey`: S3 key for thumbnail
- `thumbnailUrl`: Public URL for thumbnail
- `fullResolutionKey`: S3 key for original image
- `createdAt`/`updatedAt`: Timestamps

## 🎯 Usage

### Uploading Images

1. Navigate to `/upload` or click the "Upload Images" button
2. Select an image file (JPEG, PNG, GIF, WebP)
3. Click "Upload Image"
4. Automatic redirect to gallery after successful upload

### Viewing Images

1. Browse the responsive grid gallery on the home page
2. Download original images using the download button

## 🔒 Security Features

- **File Validation**: Server-side validation for file types and sizes
- **Pre-signed URLs**: Secure, time-limited download links
- **Input Sanitization**: Filename sanitization and content type validation
- **Error Handling**: Comprehensive error handling throughout the application

## 📈 Performance Optimizations

- **Image Optimization**: Next.js Image component with proper sizing
- **Thumbnail Generation**: Automatic thumbnail creation for fast gallery loading
- **Lazy Loading**: Images load as they enter the viewport
- **Pre-signed URLs**: Direct S3 downloads to reduce server load
- **Caching**: Proper cache headers for static assets

## 🐛 Troubleshooting

### Common Issues

1. **S3 Upload Failures**
   - Check AWS credentials and bucket permissions
   - Verify CORS configuration
   - Ensure bucket exists in the specified region

2. **Database Connection Issues**
   - Verify DATABASE_URL format
   - Check PostgreSQL server is running
   - Run `npm run db:migrate` to sync schema

3. **Image Processing Errors**
   - Ensure Sharp is properly installed
   - Check file format compatibility
   - Verify file size limits

---

Built with ❤️ using Next.js and modern web technologies.