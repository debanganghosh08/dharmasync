import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { userId, updates } = await req.json()

    if (!userId || !updates) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db()

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { name, email, address, gender, age, profilePicture } = updates

    let imageUrl = user.image;
    if (profilePicture && profilePicture.startsWith('data:image')) {
      try {
        const { url } = await cloudinary.uploader.upload(profilePicture, {});
        imageUrl = url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
      }
    }


    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          name,
          email,
          address,
          gender,
          age,
          image: imageUrl,
          updatedAt: new Date(),
        },
      }
    )

    if (result.modifiedCount === 0) {
        return NextResponse.json({ message: 'No changes were made', profilePicture: imageUrl }, { status: 200 })
    }

    return NextResponse.json({ message: 'Profile updated successfully', profilePicture: imageUrl }, { status: 200 })
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
