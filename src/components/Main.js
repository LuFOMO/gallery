//加载CSS
require('normalize.css/normalize.css');
require('styles/App.scss');
import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关数据
let imageDatas = require('json!../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = ((imageDatasArr) => {
  for (var i = 0, j = imageDatasArr.length; i < j; i++) {
    let singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

//获取区间内的一个随机值
const getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);

//获取0-30°之间一个任意正负值
var get30DegRandom = () => {
  let deg = '';
  deg = (Math.random() > 0.5) ? '+' : '-';
  return deg + Math.ceil(Math.random() * 30);
}


//单个图片组件
class ImgFigure extends React.Component {

  render() {
    let styleObj = {};
    //如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class GalleryAPP extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {//中心位置
        left: 0,
        right: 0
      },
      hPosRange: { //水平方向的取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { //垂直方向
        x: [0, 0],
        topY: [0, 0]
      }
    };
    this.state = {
      imgsArrangeArr: []
    };

  }

  /*
 重新布局所有图片
 @param centerIndex
  */
  rearrange(centerIndex) {

    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgsArrangTopArr = [],
      topImgNum = Math.ceil(Math.random() * 2),//取一个或者不取
      topImgSpliceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    //首先居中 centerindex的图片
    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    //取出要布局上侧的图片状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上侧的图片
    imgsArrangTopArr.forEach((value, index) => {
      imgsArrangTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false

      };
    });

    //布局两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边，右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      }
      else {
        hPosRangeLORX = hPosRangeRightSecX;
      }
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };

      if (imgsArrangTopArr && imgsArrangTopArr[0]) {
        imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangTopArr[0]);
      }
      imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });

    }
  }

  /*利用rearramhe函数
   *居中对应index的图片
   *
   */
  center(index) {
    return () => {
      this.rearrange(index);
    }
  }

  componentDidMount() {
    //get Stage Size
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,

      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);


    //get imageFigure Size
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    //计算左侧,右侧区域图片排布的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //计算上测区域图片排布的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    let num = Math.ceil(Math.random() * 16);
    this.rearrange(num);
  }


  render() {
    const controllerUnits = [],
      imgFigures = [];
    imageDatas.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          }
        }
      }
      imgFigures.push(<ImgFigure data={value}
                                 ref={'imgFigure' + index}
                                 arrange={this.state.imgsArrangeArr[index]}/>);
    });

    return (

      <section className="stage" ref="stage">
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
