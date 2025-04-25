<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\teacher;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index($id)
    {
        $user=User::find($id);
        if($user && $user->role !== "teacher")
        {
         return response()->json('le utilisateur n estpas un teacher');
        }
        $courses = DB::table("courses")->where('instructor_id', $id)->get();
        $students = DB:: table('users as u')
        ->join('enrollments as en','u.id','=','student_id')
        ->join('courses as c','c.id' ,"=","en.course_id")
        ->where('c.instructor_id','=',$id)
        ->get();
        $profile = DB::table('profiles')->where('user_id',$id)->get();

        return response()->json(['courses'=>$courses,'student'=>$students,'profile'=>$profile]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(teacher $teacher)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(teacher $teacher)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, teacher $teacher)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(teacher $teacher)
    {
        //
    }
}
