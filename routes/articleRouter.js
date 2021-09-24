const express = require("express")
const Article = require("../models/articleModel")
const router = express.Router()
const path = require("path")


router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article })
})

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id)
  res.render("articles/edit", { article })
})


router.get("/:slug", async (req, res) => {

  const article = await Article.findOne({ slug: req.params.slug })
  if (article == null) res.redirect("/new")

  res.render("articles/show", { article })

})

router.post("/", async (req, res, next) => {
  req.article = await new Article()
  next()
}, saveArticles("new"))


router.put("/:id", async (req, res, next) => {
  req.article = await Article.findById(req.params.id)
  next()
}, saveArticles("edit"))





router.delete("/:id", async (req, res) => {
  console.log(req.params.id)
  await Article.findByIdAndDelete(req.params.id)
  res.redirect("/")
})


function saveArticles(path) {
  return async (req, res) => {
    let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown

    try {
      article = await article.save()
      res.redirect(`/articles/${article.slug}`)
    } catch (error) {
      res.render(`articles/${path}`, { article })
    }
  }

}
module.exports = router