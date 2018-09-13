//加载CSS
require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';

//获取图片相关数据
let imageDatas = require('json!../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = ((imageDatasArr)=>{
  for (var i=0,j=imageDatasArr.length;i<j;i++)
  {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/'+singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);
//单个图片组件
class ImgFigure extends React.Component {

  render() {
    return (
      <figure>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}/>
        <figcaption>
          <h2>{this.props.data.title}1</h2>
        </figcaption>
      </figure>
    );
  }
}

class GalleryAPP extends React.Component {
  render() {
    var controllerUnits = [],
      imgFigures = [];
    imageDatas.forEach(function (value) {
      imgFigures.push(<ImgFigure data={value}/>);
    });


    return (

      <section className="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>


    );
  }


}

GalleryAPP.defaultProps = {};

export default GalleryAPP;
