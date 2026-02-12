using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Models
{
    public class Article
    {
        public int ArticleId {get;set;}
        public string Title {get;set;}
        public string Category {get;set;}
        public string Content {get;set;}
        public string Author {get;set;}
        public string ArticleImage {get;set;}

    }
}
