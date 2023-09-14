<?php

namespace App\Http\Controllers;

use App\Models\Photo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class PhotoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $photos = Photo::all();
        return response()->json($photos);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     */
    public function store(Request $request)
    {
        // make sure the folder exists in the public folder
        $imagesPath = public_path('images');
        if (!File::isDirectory($imagesPath)) {
            File::makeDirectory($imagesPath, 0777, true, true);
        }

        // unique filename for the uploaded image
        $imageName = time() . '_' . uniqid() . '.' . $request->image->getClientOriginalExtension();

        try {
            $request->image->move($imagesPath, $imageName);
            $photo = new Photo;
            $photo->title = $request->title;
            $photo->description = $request->description;
            $photo->image_path = "images/{$imageName}";
            $photo->save();
            return response()->json(['message' => 'Image uploaded successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Image upload failed: ' . $e->getMessage()], 500);
        }

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}