
const RAD_TO_DEGREE = 180/Math.PI;

AFRAME.registerComponent('follow-above-object', {
    schema: {
        objectID: {type: 'string', default: ""}
    },
    init: function () {
        this.objectToFollow = document.querySelector("#" + this.data.objectID).object3D;
    },
    tick: function () {
      if (this.objectToFollow != null) {
          var otherPosition = this.objectToFollow.getWorldPosition();
          var otherRotation = this.objectToFollow.getWorldRotation();
          this.el.setAttribute('position', otherPosition.x + " " + (otherPosition.y + 1) + " " + otherPosition.z);
          this.el.setAttribute('rotation', otherRotation.x * RAD_TO_DEGREE + " " + otherRotation.y * RAD_TO_DEGREE * -1 + " " + otherRotation.z * RAD_TO_DEGREE);
      }
    }
});