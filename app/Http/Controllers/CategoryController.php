<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Requests\CategoryRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request as RequestFacade;
use Illuminate\Support\Facades\Response;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;

class CategoryController extends Controller
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->orWhereNotExists(function ($query) {
                $query->from('categories as c')
                    ->whereColumn('c.parent_id', 'categories.id');
            })
            ->orderBy('display_order')
            ->paginate(20);

        return response()->json($categories);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

        $categories = Category::where('is_active', true)->get();
        return view('categories.create', compact('categories'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(CategoryRequest $request)
    {
        $validated = $request->validated();
        if(Category::where('title', $validated['title'])->exists()){
            return response()->json(['error' => 'La catégorie existe déjà'], 400);
        }

        $category = Category::create($validated);

        return response()->json($category, 201);
    }


    /**
     * Display the specified resource.
     */
    public function show(Category $category)
    {
        $courses = $category->courses()
            ->with(['instructor', 'ratings'])
            ->where('status', 'PUBLISHED')
            ->paginate(12);

        return response()->json($courses);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $categories = Category::where('is_active', true)
            ->where('id', '!=', $category->id)
            ->get();

        return response()->json($categories);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'display_order' => 'nullable|integer|min:0'
        ]);

        // S'assurer que is_active est un booléen
        if (isset($validated['is_active'])) {
            $validated['is_active'] = (bool)$validated['is_active'];
        }

        // S'assurer que display_order est un entier
        if (isset($validated['display_order'])) {
            $validated['display_order'] = (int)$validated['display_order'];
        }

        if ($request->hasFile('image')) {
            if ($category->image_url) {
                Storage::disk('public')->delete($category->image_url);
            }
            $validated['image_url'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($validated);

        return response()->json($category);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        if ($category->image_url) {
            Storage::disk('public')->delete($category->image_url);
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Catégorie supprimée avec succès.');
    }

    public function toggleActive(Category $category)
    {
        $category->update([
            'is_active' => !$category->is_active
        ]);

        return response()->json($category);
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id'
        ]);

        foreach ($validated['categories'] as $index => $categoryId) {
            Category::where('id', $categoryId)->update(['display_order' => $index]);
        }

        return response()->json(['message' => 'Ordre des catégories mis à jour avec succès.']);
    }

    public function getSubcategories(Category $category)
    {
        $subcategories = $category->children()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->get();

        return response()->json($subcategories);
    }

    public function getCourses(Category $category)
    {
        $courses = $category->courses()
            ->with(['instructor', 'ratings'])
            ->where('status', 'PUBLISHED')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return response()->json($courses);
    }
}
