import { html, LitElement, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { fireEvent, HomeAssistant } from "../../../ha";
import { HaFormSchema } from "../../../utils/form/ha-form";
import { computeChipEditorComponentName } from "../../../utils/lovelace/chip/chip-element";
import { EntityChipConfig, QuickBarMode } from "../../../utils/lovelace/chip/types";
import { LovelaceChipEditor } from "../../../utils/lovelace/types";
import { DEFAULT_QUICKBAR_ICON, DEFAULT_QUICKBAR_MODE } from "./quickbar-chip";

const SCHEMA: HaFormSchema[] = [
  { name: "icon", selector: { icon: { placeholder: DEFAULT_QUICKBAR_ICON } } },
  {
    name: "mode",
    selector: {
      select: {
        options: [{ value: QuickBarMode.Entity, label: "Entity" }, { value: QuickBarMode.Device, label: "Device" }, { value: QuickBarMode.Command, label: "Command" }]
      }
    }
  },
];

@customElement(computeChipEditorComponentName("quickbar"))
export class QuickBarChipEditor extends LitElement implements LovelaceChipEditor {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: EntityChipConfig;

  public setConfig(config: EntityChipConfig): void {
    this._config = config;
  }

  private _computeLabel = (schema: HaFormSchema) => {
    return this.hass!.localize(
      `ui.panel.lovelace.editor.card.generic.${schema.name}`
    );
  };

  protected render() {
    if (!this.hass || !this._config) {
      return nothing;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    fireEvent(this, "config-changed", { config: ev.detail.value });
  }
}
