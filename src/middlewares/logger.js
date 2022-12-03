const logger = (req, res, next) => {
    console.log({
        sid: req.session.id,
        requestAt:  new Date(),
        url: req.url,
        queryParams: req.query,
        ip: req.ip,
        session: req.session
    });
    next();
    // if (req.query.key == "CHAVE")
}

module.exports =  logger;