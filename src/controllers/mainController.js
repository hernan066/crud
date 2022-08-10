const fs = require("fs");
const path = require("path");

const productsFilePath = path.join(__dirname, "../data/productsDataBase.json");


const toThousand = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
  index: (req, res) => {
    
    const products = JSON.parse(fs.readFileSync(productsFilePath, "utf-8"));
    
    const lastView = products.filter(
      (product) => product.category === "visited"
    );
    const inSale = products.filter((product) => product.category === "in-sale");

    return res.render("index", {
		lastView, 
		inSale,
		toThousand
	});
  },
  
  
  search: (req, res) => {
    let {keywords} = req.query;
        const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'productsDataBase.json')));

        let result = products.filter(product => product.name.toLowerCase().includes(keywords.toLowerCase()));

        //return res.send(result)

        return res.render("results",{
            keywords,
            result
        })
  },
};

module.exports = controller;
