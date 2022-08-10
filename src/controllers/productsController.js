const fs = require("fs");
const path = require("path");
const { brotliDecompressSync } = require("zlib");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");
const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  // Root - Show all products
  index: (req, res) => {
    return res.render("products", {
      products,
      toThousand,
      
    });
  },

  // Detail - Detail from one product
  detail: (req, res) => {
    const products1 = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));

    const product = products1.find((product) => product.id === +req.params.id);

    return res.render("detail", {
      product,
      toThousand,
      
    });
  },

  // Create - Form to create
  create: (req, res) => {
    return res.render("product-create-form");
  },

  // Create -  Method to store
  store: (req, res) => {
    const { id } = req.params;
    let { name, price, discount, description, category } = req.body;

    let newProduct = {
      id: products[products.length - 1].id + 1,
      name: name.trim(),
      description: description.trim(),
      price: +price,
      discount: +discount,
      category,
      image: "default-image.png",
    };

    let productsNew = [...products, newProduct];

    fs.writeFileSync(
      path.join(__dirname, "..", "data", "productsDataBase.json"),
      JSON.stringify(productsNew, null, 3),
      "utf-8"
    );
    return res.redirect("/");
  },

  // Update - Form to edit
  edit: (req, res) => {
    const productToEdit = products.find(
      (product) => product.id === +req.params.id
    );

    return res.render("product-edit-form", {
      productToEdit,
      toThousand,
    });
  },
  // Update - Method to update
  update: (req, res) => {
    const { id } = req.params;
    let { name, price, discount, description, category } = req.body;

    const productModify = products.map((product) => {
      if (product.id === +id) {
        return {
          ...product,
          name: name.trim(),
          description: description.trim(),
          price: +price,
          discount: +discount,
          category,
        };
      } else {
        return product;
      }
    });

    fs.writeFileSync(
      path.join(__dirname, "..", "data", "productsDataBase.json"),
      JSON.stringify(productModify, null, 3),
      "utf-8"
    );
    return res.redirect("/products/detail/" + id);
  },

  // Delete - Delete one product from DB
  destroy: (req, res) => {
    const { id } = req.params;

    const productFilter = products.filter((product) => product.id !== +id);

    fs.writeFileSync(
      path.join(__dirname, "..", "data", "productsDataBase.json"),
      JSON.stringify(productFilter, null, 3),
      "utf-8"
    );
    return res.redirect("/");
  },
};

module.exports = controller;
