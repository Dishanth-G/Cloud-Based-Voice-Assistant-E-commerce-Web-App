class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }

search() {
  // if keyword present we make as name object with the product name and make it case insensitive else do nothing
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

      // console.log(keyword);

    this.query = this.query.find({ ...keyword });
    return this;   

    }


filter() {
    //Here we are copying it instead of referencing it
    const queryCopy = { ...this.queryStr };
    // console.log(queryCopy)

    //   Removing some fields for category
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryCopy[key]);
  // left with category,price and rating
    // console.log(queryCopy)

    // Filter For Price and Rating
    let queryStr = JSON.stringify(queryCopy);
    // Refer: https://www.geeksforgeeks.org/mongodb-greater-than-equals-to-operator-gte/
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));



    // console.log(queryStr)

    return this;

}


    pagination(resultPerPage){
        const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.limit(resultPerPage).skip(skip);

    return this;
    }

}
module.exports = ApiFeatures;