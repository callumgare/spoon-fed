export type Recipe = {
	uid: string;
	name: string;
	ingredients: string;
	directions: string;
	description: string;
	notes: string;
	nutritional_info: string;
	servings: string;
	difficulty: string;
	prep_time: string;
	cook_time: string;
	total_time: string;
	source: string;
	source_url: string;
	image_url: string;
	photo: string;
	photo_hash: string;
	photo_large: null;
	scale: string;
	hash: string;
	categories: string[];
	rating: number;
	in_trash: boolean;
	is_pinned: boolean;
	on_favorites: boolean;
	on_grocery_list: boolean;
	created: Date;
	photo_url: string;
};

export type Category = {
	uid: string;
	name: string;
	order_flag: number;
	parent_uid: null;
};

export type RecipeIndexItem = {
	uid: string;
	hash: string;
};

export type Status = {
	categories: number;
	recipes: number;
	photos: number;
	groceries: number;
	grocerylists: number;
	groceryaisles: number;
	groceryingredients: number;
	meals: number;
	mealtypes: number;
	bookmarks: number;
	pantry: number;
	pantrylocations: number;
	menus: number;
	menuitems: number;
};

export type LoginDetails =
	| {
			email: string;
			password: string;
	  }
	| {
			auth: string;
	  };
