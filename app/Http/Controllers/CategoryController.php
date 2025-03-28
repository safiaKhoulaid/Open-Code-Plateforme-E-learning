<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $categories = Category::with('parent')
            ->orderBy('display_order')
            ->paginate(20);

        return view('categories.index', compact('categories'));
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
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:categories,id',
            'image' => 'nullable|image|max:2048',
            'is_active' => 'boolean',
            'display_order' => 'required|integer|min:0'
        ]);

        if ($request->hasFile('image')) {
            $validated['image_url'] = $request->file('image')->store('categories', 'public');
        }

        Category::create($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Catégorie créée avec succès.');
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

        return view('categories.show', compact('category', 'courses'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $categories = Category::where('is_active', true)
            ->where('id', '!=', $category->id)
            ->get();

        return view('categories.edit', compact('category', 'categories'));
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
            'display_order' => 'required|integer|min:0'
        ]);

        if ($request->hasFile('image')) {
            if ($category->image_url) {
                Storage::disk('public')->delete($category->image_url);
            }
            $validated['image_url'] = $request->file('image')->store('categories', 'public');
        }

        $category->update($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Catégorie mise à jour avec succès.');
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

        return back()->with('success', $category->is_active ? 'Catégorie activée avec succès.' : 'Catégorie désactivée avec succès.');
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
