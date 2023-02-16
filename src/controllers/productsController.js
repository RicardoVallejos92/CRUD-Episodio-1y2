const fs = require('fs');
const path = require('path');
const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
const writeJson = (database) =>{
	fs.writeFileSync(path.join(__dirname, '../data/productsDataBase.json'), JSON.stringify(database), "utf-8");
}
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {

	// Root - Show all products
	index: (req, res) => {
		
		res.render('products', {
			products,
			toThousand
		})

	},

	// Detail - Detail from one product
	detail: (req, res) => {

		let product= products.find(product => product.id === +req.params.id);


		res.render('detail', {
			product,
			toThousand
		});
	
	},

	// Create - Form to create
	create: (req, res) => {

		res.render('product-create-form');

	},
	
	// Create -  Method to store
	store: (req, res) => {

		let lastId = 1;
		products.forEach(product => {
			if (product.id > lastId){
				lastId = product.id;
			}			
		});

		let newProduct ={
			id: lastId + 1,
			name: req.body.name,
			price: +req.body.price,
			discount: +req.body.discount, 
			category: req.body.category, 
			description: req.body.description,
			image: req.file ? req.file.filename : "default-image.png"
		}

		products.push(newProduct);
		writeJson(products);
		res.redirect(`/products#${newProduct.id}`);

	},

	// Update - Form to edit
	edit: (req, res) => {

		let product= products.find(product => product.id === +req.params.id);

		res.render('product-edit-form', {
			product
		})

	},

	// Update - Method to update
	update: (req, res) => {

		const{
			name,
			price,
			discount, 
			category, 
			description
		} = req.body

		products.forEach(product =>{
			if(product.id === +req.params.id){
				product.id = product.id,
				product.name = name,
				product.price = price,
				product.discount = discount,
				product.category = category,
				product.description = description
				product.image = req.file ? req.file.filename : product.image
			}
		})

		writeJson(products);	
		res.send(`Has editado el producto ${name}`);

	},



	// Delete - Delete one product from DB
	destroy : (req, res) => {

		let product = products.find(product => product.id === +req.params.id);

		products.forEach(product => {
			if (product.id === +req.params.id){
				let productToDestroy = products.indexOf(product);
				products.splice(productToDestroy, 1);
			}
		})

		writeJson(products);
		res.send(`Has eliminado el producto ${product.name}`);
	}

};

module.exports = controller;