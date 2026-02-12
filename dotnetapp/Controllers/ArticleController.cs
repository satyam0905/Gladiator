using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Services;
using System.Linq;
using dotnetapp.Models;
using Microsoft.AspNetCore.Authorization;


namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/articles")]
    [Authorize]
    public class ArticleController:ControllerBase
    {
         public ArticleService _articleService;
         public ArticleController(ArticleService articleService){
            _articleService=articleService;
         }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Article>>> GetAllArticles(){
            try{
                 
                var list=await _articleService.GetAllArticles();
                if(list==null){
                    return NoContent();
                }
                return Ok(list);


            }catch(Exception ){
                return StatusCode(500);
            }

        }

        [AllowAnonymous]
        [HttpGet("{articleId}")]
        public async Task<ActionResult<Article>> GetArticleById(int articleId){
           try{
                 
                var list=await _articleService.GetArticleById(articleId);
                if(list==null){
                    return NotFound("Cannot find any article");
                }
                return Ok(list);


            }catch(Exception ){
                return StatusCode(500);
            }
        

        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult> AddArticle([FromBody] Article article){
            try{
                 
                if(article==null){
                    return BadRequest();
                }
              bool list=await _articleService.AddArticle(article);
              if(!list){
                return StatusCode(500,"Failed to add article");
              }
                return Ok("Article added successfully");


            }catch(Exception ex){
                return StatusCode(500,ex.Message);
            }
            
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{articleId}")]
        public async Task<ActionResult> UpdateArticle(int articleId,[FromBody] Article article){
           
              try{
                 
                if(article==null){
                    return BadRequest();
                }
              bool list=await _articleService.UpdateArticle(articleId,article);
              if(!list){
                return NotFound("Failed to update article");
              }
                return Ok("Article updated successfully");


            }catch(Exception ex){
                return StatusCode(500,ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{articleId}")]
        public async Task<ActionResult> DeleteArticle(int articleId){

             try{
                 
                if(articleId<=0){
                    return BadRequest();
                }
              bool list=await _articleService.DeleteArticle(articleId);
              if(!list){
                return NotFound("Cannot Find Any Article");
              }
                return Ok("Article deleted successfully");


            }catch(Exception ){
                return StatusCode(500);
            }

        }
        
    }
}
