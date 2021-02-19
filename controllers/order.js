const {Order,ProductCart} = require("../models/order")

exports.getOrderId = (req,res,next,id)=>{
    Order.findById(id)
    .populate('products.product',"name price")
    .exec((err,order)=>{
        if(err||!order)
        {
            res.status(400).json({
                status:400,
                error:err.errors
            })
        }
        req.order=order;
        next();
    });
}

exports.createOrder = (req,res)=>{
    req.body.order.user = req.profile
    const order = new Order(req.body.order)
    order.save().exec((err,order)=>{
        if(err){
            return res.status(400).json({
                status:400,
                error: err.errors,
                message:"failed to save order"
            })
        }
        return res.send(200).json({
            status:200,
            order:order,
            message:"order saved"
        })
    })
}

exports.getAllOrders=(req,res)=>{
    Order.find()
    .populate("user","_id name")
    .exec((err,orders)=>{
        if(err){
            return res.status(400).json({
                status:400,
                error: err.errors,
                message:"No orders found"
            })
        }
    })
    return res.send(200).json({
        status:200,
        order:order,
        message:"orders fetched"
    })
}

exports.getOrderStatus=(req,res)=>{
    res.json(Order.schema.path("status").enumValues)
}

exports.updateStatus=(req,res)=>{
    Order.update(
        {_id:req.body.orderId},
        {$set:{status:req.body.status}},(err,order)=>{
            if(err){
                return res.status(400).json({
                    status:400,
                    error: err.errors,
                    message:"couldn't update order status"
                })
            }
            return res.send(200).json({
                status:200,
                order:order,
                message:"status updated"
            }) 
        })
}