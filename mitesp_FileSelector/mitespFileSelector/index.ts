import { FileValidated } from "@dropzone-ui/react";
import {
  FileSelector,
  IFileSelectorProps,
} from "./components/SelectFileswithDargNDrop";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";

const fileDetails = (file: File) => {
  let fileContent: string;
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
      var contents = e.target?.result;
      resolve(contents as string);
      console.log(contents);
    };
  });
};

export class mitespFileSelector
  implements ComponentFramework.ReactControl<IInputs, IOutputs>
{
  //Initialize Variables
  private _context: ComponentFramework.Context<IInputs>;
  private _notifyOutputChanged: () => void;
  private _incommingFiles: FileValidated[];
  private _outputJSON: String;
  private _file: string;
  private _onChange: (newFiles: FileValidated[]) => void;
  private _onClean: (files: FileValidated[]) => void;
  /**
   * Empty constructor.
   */
  constructor() {}

  /**
   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
   * Data-set values are not initialized here, use updateView.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
   */
  public init(
    context: ComponentFramework.Context<IInputs>,
    notifyOutputChanged: () => void,
    state: ComponentFramework.Dictionary
  ): void {
    // Add control initialization code
    this._outputJSON = "";
    this._notifyOutputChanged = notifyOutputChanged;
    this._context = context;
    this._onChange = this.onChange.bind(this);
    this._onClean = this.onClean.bind(this);
  }

  //
  /**
   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
   * @returns ReactElement root react element for the control
   */
  public updateView(
    context: ComponentFramework.Context<IInputs>
  ): React.ReactElement {
    //const props: IHelloWorldProps = { name: 'Hello, World!' };
    return React.createElement(FileSelector, {
      onChange: this.onChange,
      onDelete: this.onDelete,
      onSee: this.onSee,
      onClean: this.onClean,
    });
  }

  public onDelete = (id: string | number | undefined): void => {
    this._notifyOutputChanged();
  };
  public onSee = (imageSource: string): void => {
    this._notifyOutputChanged();
  };
  public onClean = (files: FileValidated[]): void => {
    this._outputJSON = "";
    this._notifyOutputChanged();
  };

  public onChange = async (newFiles: FileValidated[]): Promise<void> => {
    console.log(newFiles);

    // conversion and add to the json
    let files: Object[] = [];

    for await (const fileValidate of newFiles) {
      let fileDetailsObj = new Object().constructor({
        id: Number,
        fileName: String,
        fileType: String,
        fileSize: String,
        fileContent: String,
      });

      try {
        fileDetailsObj.id = fileValidate.id;
        fileDetailsObj.fileName = fileValidate.file.name;
        fileDetailsObj.fileType = fileValidate.file.type;
        fileDetailsObj.fileSize = fileValidate.file.size;

        //this.getFileContent(fileValidate.file).then(fileContent=>{fileDetailsObj.fileContent=fileContent; files.push(fileDetailsObj);this.notifyOutputChanged();})

        fileDetailsObj.fileContent = await fileDetails(fileValidate.file);

        files.push(fileDetailsObj);
      } catch (error) {
        console.log(error);
      }
    }

    this._outputJSON = JSON.stringify(files);
    console.log(this._outputJSON);
    this._notifyOutputChanged();

    //generate json object
  };

  // file con
  /**
   * It is called by the framework prior to a control receiving new data.
   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
   */
  public getOutputs(): IOutputs {
    return { outProperty: this._outputJSON.toString() };
  }

  /**
   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
   * i.e. cancelling any pending remote calls, removing listeners, etc.
   */
  public destroy(): void {
    // Add code to cleanup control if necessary
  }
}
