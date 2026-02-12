using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.EntityFrameworkCore;

namespace dotnetapp.Services
{
    public class ArticleService
    {
        private readonly ApplicationDbContext _context;
        public ArticleService(ApplicationDbContext context)
        {
            _context=context;
        }
        public async Task<IEnumerable<Article>> GetAllArticles()
        {
            return await _context.Articles.ToListAsync();

        }
        public async Task<Article>GetArticleById(int articleId)
        {
          return await _context.Articles.FirstOrDefaultAsync(c=>c.ArticleId==articleId);
        }
        public async Task<bool>AddArticle(Article article)
        {
           _context.Articles.Add(article);
           await _context.SaveChangesAsync();
           return true;
        }
        public async Task<bool>UpdateArticle(int articleId,Article article)
        {
          var e=await GetArticleById(articleId);
          if(e==null)
          {
            return false;
          }
          e.Title=article.Title;
          e.Category=article.Category;
          e.Content=article.Content;
          e.Author=article.Author;
          e.ArticleImage=article.ArticleImage;
          await _context.SaveChangesAsync();
          return true;
        }

        public async Task<bool>DeleteArticle(int articleId)
        {
          var e= await GetArticleById(articleId);
          if(e==null)
          {
            return false;
          }
          _context.Articles.Remove(e);
          await _context.SaveChangesAsync();
          return true;
        }
    }
}
