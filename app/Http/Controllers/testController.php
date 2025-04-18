<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class testController extends Controller
{
  public function index(){
    $users = DB::table("users")->pluck('firstName');
    dd($users);
  }
}
