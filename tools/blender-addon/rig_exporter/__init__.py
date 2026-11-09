"""Export the evaluated Blender scene as a Rig document (.rig).

Implements docs/blender.md: collections, objects, meshes with one
Principled material, cameras, lights, armatures with skins, and
optionally actions sampled to rig.anim.clip / rig.anim.track.
Anything else stays in the .blend and is named in a warning.

Install: Preferences > Add-ons > Install, pick a zip of this
``rig_exporter`` folder, enable "Import-Export: Rig Document".
Use: File > Export > Rig Document (.rig).
"""

import json

import bpy
from bpy.props import BoolProperty, IntProperty
from bpy_extras.io_utils import ExportHelper

from . import collect, core

bl_info = {
    "name": "Import-Export: Rig Document",
    "author": "RigWorks contributors",
    "version": (0, 1, 0),
    "blender": (3, 6, 0),
    "location": "File > Export > Rig Document (.rig)",
    "description": "Export the evaluated scene as a Rig document (.rig)",
    "category": "Import-Export",
}


class ExportRig(bpy.types.Operator, ExportHelper):
    """Export the evaluated scene as a Rig document"""

    bl_idname = "export_scene.rig"
    bl_label = "Export Rig Document"
    bl_options = {"REGISTER"}

    filename_ext = ".rig"
    filter_glob: bpy.props.StringProperty(default="*.rig", options={"HIDDEN"})

    apply_modifiers: BoolProperty(
        name="Apply Modifiers",
        description="Export the dependency-graph evaluated mesh. "
                    "Skinned meshes always export unevaluated (bind pose)",
        default=True,
    )
    export_animation: BoolProperty(
        name="Export Animation",
        description="Sample assigned actions frame by frame into "
                    "rig.anim.clip / rig.anim.track",
        default=False,
    )
    frame_step: IntProperty(
        name="Frame Step",
        description="Sample every Nth frame when exporting animation",
        default=1,
        min=1,
        max=30,
    )

    def execute(self, context):
        scene = collect.collect_scene(
            bpy,
            apply_modifiers=self.apply_modifiers,
            export_animation=self.export_animation,
            frame_step=self.frame_step,
        )
        document, warnings = core.build_document(scene)
        with open(self.filepath, "w", encoding="utf-8") as handle:
            json.dump(document, handle, indent=2)
            handle.write("\n")
        for warning in warnings:
            self.report({"WARNING"}, warning)
        self.report({"INFO"}, "Wrote %s (%d entities)"
                    % (self.filepath, len(document["entities"])))
        return {"FINISHED"}


def _menu_export(self, context):
    self.layout.operator(ExportRig.bl_idname, text="Rig Document (.rig)")


def register():
    bpy.utils.register_class(ExportRig)
    bpy.types.TOPBAR_MT_file_export.append(_menu_export)


def unregister():
    bpy.types.TOPBAR_MT_file_export.remove(_menu_export)
    bpy.utils.unregister_class(ExportRig)


if __name__ == "__main__":
    register()
