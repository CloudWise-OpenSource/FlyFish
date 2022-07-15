package com.cloudwise.lcap.test.udf.hr;

public class Product {

    private Integer prodId;
    private Integer sale;

    public Product(Integer prodId, Integer sale) {
        this.prodId = prodId;
        this.sale = sale;
    }

    public Integer getProdId() {
        return prodId;
    }

    public void setProdId(Integer prodId) {
        this.prodId = prodId;
    }

    public Integer getSale() {
        return sale;
    }

    public void setSale(Integer sale) {
        this.sale = sale;
    }
}
