import Product from '../Product';

class ProductBuilder {
    constructor(){ }

    /* Define all the steps needed to create a profile */

    setName(name) {
        this.name = name;
        return this;
    }

    /* Could also be called getProduct() */
    build() {
        return new Product(this);
    }
}

export default ProductBuilder;